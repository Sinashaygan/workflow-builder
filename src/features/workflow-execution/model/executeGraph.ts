import type {
  WorkflowEdge,
  WorkflowNode,
} from "@/entities/workflow/model";

type NodeOfType<T extends WorkflowNode["type"]> = Extract<
  WorkflowNode,
  { type: T }
>;

export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export type ExecutionStep =
  | { kind: "enter_node"; node: WorkflowNode }
  | { kind: "evaluate_condition"; node: NodeOfType<"condition"> }
  | {
      kind: "choose_branch";
      nodeId: string;
      branch: "true" | "false" | "fallthrough";
    }
  | { kind: "execute_action"; node: NodeOfType<"action"> }
  | {
      kind: "execute_delay";
      node: NodeOfType<"delay">;
      durationMs: number;
    }
  | { kind: "reach_end"; node: NodeOfType<"end"> }
  | { kind: "finished" }
  | { kind: "failed"; nodeId?: string; reason: string };

export interface ExecutionContext {
  workflow: WorkflowGraph;
  nodeById: Map<string, WorkflowNode>;
  outgoingEdges: Map<string, WorkflowEdge[]>;
  variableStore: Record<string, unknown>;
}

const MAX_EXECUTION_STEPS = 10_000;

export function buildExecutionContext(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  initialVariables: Record<string, unknown> = {},
): ExecutionContext {
  const nodeById = new Map<string, WorkflowNode>(
    nodes.map((node: WorkflowNode) => [node.id, node]),
  );
  const outgoingEdges = new Map<string, WorkflowEdge[]>(
    nodes.map((node: WorkflowNode) => [node.id, []]),
  );

  edges.forEach((edge: WorkflowEdge) => {
    outgoingEdges.get(edge.source)?.push(edge);
  });

  return {
    workflow: { nodes, edges },
    nodeById,
    outgoingEdges,
    variableStore: { ...initialVariables },
  };
}

export function* createStepRunner(
  context: ExecutionContext,
): Generator<ExecutionStep, void, void> {
  const startNode = context.workflow.nodes.find(
    (node: WorkflowNode): node is NodeOfType<"start"> => node.type === "start",
  );

  if (!startNode) {
    yield { kind: "failed", reason: "No Start node found." };
    return;
  }

  const visited = new Set<string>();
  let currentNode: WorkflowNode | undefined = startNode;
  let steps = 0;

  while (currentNode) {
    steps += 1;
    if (steps > MAX_EXECUTION_STEPS) {
      yield {
        kind: "failed",
        nodeId: currentNode.id,
        reason: `Execution exceeded the ${MAX_EXECUTION_STEPS.toLocaleString()}-step safety limit.`,
      };
      return;
    }

    if (visited.has(currentNode.id)) {
      yield {
        kind: "failed",
        nodeId: currentNode.id,
        reason: "Infinite loop detected: a node was visited more than once.",
      };
      return;
    }
    visited.add(currentNode.id);

    yield { kind: "enter_node", node: currentNode };

    if (currentNode.type === "end") {
      yield { kind: "reach_end", node: currentNode };
      return;
    }

    let nextEdge: WorkflowEdge | undefined;

    switch (currentNode.type) {
      case "start":
        nextEdge = getSingleOutgoingEdge(context, currentNode.id);
        break;

      case "action":
        yield { kind: "execute_action", node: currentNode };
        nextEdge = getSingleOutgoingEdge(context, currentNode.id);
        break;

      case "delay":
        yield {
          kind: "execute_delay",
          node: currentNode,
          durationMs: toMilliseconds(
            currentNode.config.durationMs,
            currentNode.config.unit,
          ),
        };
        nextEdge = getSingleOutgoingEdge(context, currentNode.id);
        break;

      case "condition": {
        yield { kind: "evaluate_condition", node: currentNode };
        const result = evaluateCondition(currentNode, context.variableStore);
        const outgoingEdges = context.outgoingEdges.get(currentNode.id) ?? [];
        nextEdge = outgoingEdges.find(
          (edge: WorkflowEdge) =>
            (edge.branch ?? edge.sourceHandle) === result,
        );

        yield {
          kind: "choose_branch",
          nodeId: currentNode.id,
          branch: nextEdge ? result : "fallthrough",
        };
        break;
      }
    }

    if (!nextEdge) {
      yield {
        kind: "failed",
        nodeId: currentNode.id,
        reason:
          currentNode.type === "condition"
            ? "No outgoing edge matches the evaluated condition branch."
            : "Node has no outgoing edge.",
      };
      return;
    }

    const nextNode = context.nodeById.get(nextEdge.target);
    if (!nextNode) {
      yield {
        kind: "failed",
        nodeId: currentNode.id,
        reason: `Edge points to missing node "${nextEdge.target}".`,
      };
      return;
    }

    currentNode = nextNode;
  }

  yield { kind: "finished" };
}

function toMilliseconds(
  duration: number,
  unit: NodeOfType<"delay">["config"]["unit"],
): number {
  switch (unit) {
    case "seconds":
      return duration * 1_000;
    case "minutes":
      return duration * 60_000;
    case "hours":
      return duration * 3_600_000;
  }
}

function getSingleOutgoingEdge(
  context: ExecutionContext,
  nodeId: string,
): WorkflowEdge | undefined {
  return context.outgoingEdges.get(nodeId)?.[0];
}

function evaluateCondition(
  node: NodeOfType<"condition">,
  variableStore: Record<string, unknown>,
): "true" | "false" {
  const { field, operator, value } = node.config;
  const actual = resolveField(variableStore, field);

  switch (operator) {
    case "equals":
      return actual === value ? "true" : "false";
    case "not_equals":
      return actual !== value ? "true" : "false";
    case "greater_than":
      return Number(actual) > Number(value) ? "true" : "false";
    case "less_than":
      return Number(actual) < Number(value) ? "true" : "false";
    case "contains":
      return String(actual).includes(String(value)) ? "true" : "false";
  }
}

function resolveField(
  variableStore: Record<string, unknown>,
  field: string,
): unknown {
  return field.split(".").reduce<unknown>((value, key) => {
    if (!isUnknownRecord(value)) {
      return undefined;
    }
    return value[key];
  }, variableStore);
}

function isUnknownRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
