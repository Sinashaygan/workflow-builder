import { WorkflowEdge, WorkflowNode } from "@/entities/workflow/model";

const NODE_WIDTH = 260;
const NODE_HEIGHT = 120;

export interface LayoutOptions {
  direction?: "TB" | "LR";
}

export function getLayoutedElements(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  options: LayoutOptions = { direction: 'TB' }
): Record<string, { x: number; y: number }> {}