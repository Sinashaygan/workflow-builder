import { NodeType, WorkflowNode } from "@/entities/workflow/model";

export function createDefaultNode(
  type: NodeType,
  position: { x: number; y: number },
): {
  node: WorkflowNode;
  position: { x: number; y: number };
} {
  const id = crypto.randomUUID();
  let node: WorkflowNode;

  switch (type) {
    case "start":
      node = {
        id,
        type: "start",
        label: "Start Trigger",
        config: { triggerType: "manual" },
      };
      break;
    case "action":
      node = {
        id,
        type: "action",
        label: "Action Node",
        config: { actionType: "http_request", endpoint: "", retryCount: 0 },
      };
      break;
    case "condition":
      node = {
        id,
        type: "condition",
        label: "Condition Node",
        config: { field: "status", operator: "equals", value: "active" },
      };
      break;
    case "delay":
      node = {
        id,
        type: "delay",
        label: "Delay Node",
        config: { durationMs: 5, unit: "seconds" },
      };
      break;
    case "end":
      node = {
        id,
        type: "end",
        label: "End Flow",
        config: { status: "success" },
      };
      break;
  }

  return { node, position };
}