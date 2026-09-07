import { WorkflowEdge, WorkflowNode } from "@/entities/workflow/model";
import dagre from "@dagrejs/dagre";

const NODE_WIDTH = 260;
const NODE_HEIGHT = 120;

export interface LayoutOptions {
  direction?: "TB" | "LR";
}

export function getLayoutedElements(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  options: LayoutOptions = { direction: "TB" },
): Record<string, { x: number; y: number }> {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: options.direction,
    nodesep: 50,
    ranksep: 80,
  });
}
