import { NodeType, WorkflowState } from "./types";

const initialState: WorkflowState = {
  workflow: {
    id: crypto.randomUUID(),
    name: "WorkFlow without name",
    version: 1,
    nodes: [],
    edges: [],
  },
  ui: {
    nodePositions: {},
    selectedNodeId: null,
    selectedEdgeId: null,
    isDirty: false,
  },
};

const connectionRules: Record<NodeType, NodeType[]> = {
  start: ["action", "condition", "delay", "end"],
  action: ["action", "condition", "delay", "end"],
  condition: ["condition", "delay", "end", "action"],
  delay: ["action", "condition", "end"],
  end: [], 
};

export const canConnect = (sourceType:NodeType ,targetType:NodeType ):boolean=>{
    return connectionRules[sourceType].includes(targetType) ?? false
}