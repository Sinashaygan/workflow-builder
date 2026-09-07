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

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const positions: Record<string, { x: number; y: number }> = {};

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    if (nodeWithPosition) {
      positions[node.id] = {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      };
    }
  });

  return positions;

}
