import type { Node as RFNode } from "@xyflow/react";
import { WorkflowNode } from "./types";

export function toReactFlowNode(
  node: WorkflowNode,
  position: { x: number; y: number },
): RFNode {
  return {
    id: node.id,
    type: node.type, 
    position,
    data: {
      label: node.label,
      description: node.description,
      config: node.config,
      nodeType: node.type,
    },
  } satisfies RFNode;
}
