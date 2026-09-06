import type { Node as RFNode, Edge as RFEdge } from "@xyflow/react";
import { WorkflowEdge, WorkflowNode } from "./types";

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

export function toReactFlowEdge(edge: WorkflowEdge): RFEdge {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    sourceHandle: edge.sourceHandle ?? undefined,
    targetHandle: edge.targetHandle ?? undefined,
  };
}