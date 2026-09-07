import type {
  WorkflowEdge,
  WorkflowNode,
} from "@/entities/workflow/model";

export function findCycles(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): string[] {
  const graph = new Map<string, string[]>();

  for (const node of nodes) {
    graph.set(node.id, []);
  }

  for (const edge of edges) {
    const neighbors = graph.get(edge.source);

    if (neighbors) {
      neighbors.push(edge.target);
    }
  }

  const color = new Map<string, "white" | "gray" | "black">();

  for (const node of nodes) {
    color.set(node.id, "white");
  }

  const cycleNodes = new Set<string>();

  function visit(nodeId: string, currentPath: string[]): void {
    color.set(nodeId, "gray");
    currentPath.push(nodeId);

    for (const neighborId of graph.get(nodeId) ?? []) {
      const neighborColor = color.get(neighborId);

      if (neighborColor === "gray") {
        const cycleStartIndex = currentPath.indexOf(neighborId);

        if (cycleStartIndex !== -1) {
          for (
            let index = cycleStartIndex;
            index < currentPath.length;
            index += 1
          ) {
            cycleNodes.add(currentPath[index]);
          }

          cycleNodes.add(neighborId);
        }

        continue;
      }

      if (neighborColor === "white") {
        visit(neighborId, currentPath);
      }
    }

    currentPath.pop();
    color.set(nodeId, "black");
  }

  for (const node of nodes) {
    if (color.get(node.id) === "white") {
      visit(node.id, []);
    }
  }

  return [...cycleNodes];
}
 