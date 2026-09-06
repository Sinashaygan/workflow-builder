import type { Node as RFNode, Edge as RFEdge } from "@xyflow/react";
import type { WorkflowEdge, WorkflowNode, NodeType } from "./types";

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

export function fromReactFlowNode(rfNode: RFNode): WorkflowNode {
  const { data } = rfNode;
  return {
    id: rfNode.id,
    type: (data.nodeType ?? data.type) as NodeType,
    label: String(data.label ?? "Untitled node"),
    description: data.description,
    config: data.config,
  } as WorkflowNode;
}
