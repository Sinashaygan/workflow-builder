import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NodeType, WorkflowEdge, WorkflowNode, WorkflowState } from "./types";

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

export const canConnect = (
  sourceType: NodeType,
  targetType: NodeType,
): boolean => {
  return connectionRules[sourceType].includes(targetType) ?? false;
};

const graphSlice = createSlice({
  name: "workflowGraph",
  initialState,
  reducers: {
    addNode: (state, action: PayloadAction<WorkflowNode>) => {},

    updateNodePosition: (
      state,
      action: PayloadAction<{ id: string; position: { x: number; y: number } }>,
    ) => {},

    updateNodeConfig: (
      state,
      action: PayloadAction<{ id: string; config: unknown }>,
    ) => {},

    addEdge: (state, action: PayloadAction<WorkflowEdge>) => {},

    removeEdge: (state, action: PayloadAction<string>) => {},

    removeNode: (state, action: PayloadAction<string>) => {},

    selectNode: (state, action: PayloadAction<string | null>) => {},
  },
});
