import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NodeType, WorkflowEdge, WorkflowNode, WorkflowState } from "./types";
import { ActionNodeConfigSchema, ConditionNodeConfigSchema, DelayNodeConfigSchema, EndNodeConfigSchema, StartNodeConfigSchema } from "./schemas";

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
    addNode: (state, action: PayloadAction<WorkflowNode>) => {
        const node = action.payload;
        state.workflow.nodes.push(node);
        state.ui.nodePositions[node.id] = { x: 0, y: 0 }; 
        state.ui.isDirty = true;
        state.ui.selectedNodeId = node.id;
    },

    updateNodePosition: (
      state,
      action: PayloadAction<{ id: string; position: { x: number; y: number } }>,
    ) => {
        const { id, position } = action.payload;
        if (state.ui.nodePositions[id]) {
          state.ui.nodePositions[id] = position;
          state.ui.isDirty = true;
        }
    },

    updateNodeConfig: (
      state,
      action: PayloadAction<{ id: string; config: unknown }>,
    ) => {
        const node = state.workflow.nodes.find(
          (n) => n.id === action.payload.id,
        );
        
        if(!node) return;
        const {config} = action.payload

        switch (node.type) {
          case "start":
            node.config = StartNodeConfigSchema.parse(config);
            break;

          case "action":
            node.config = ActionNodeConfigSchema.parse(config);
            break;

          case "condition":
            node.config = ConditionNodeConfigSchema.parse(config);
            break;

          case "delay":
            node.config = DelayNodeConfigSchema.parse(config);
            break;

          case "end":
            node.config = EndNodeConfigSchema.parse(config);
            break;
        }
    },

    addEdge: (state, action: PayloadAction<WorkflowEdge>) => {
        const doesExist = state.workflow.edges.some(
          (e) =>
            e.source === action.payload.source &&
            e.target === action.payload.target,
        );
        if (doesExist) return;

        const sourceNode = state.workflow.nodes.find(
          (n) => n.id === action.payload.source,
        );
        const targetNode = state.workflow.nodes.find(
          (n) => n.id === action.payload.target,
        );

        if (!sourceNode || !targetNode) return;

        if (canConnect(sourceNode.type, targetNode.type)) {
          state.workflow.edges.push(action.payload);
          state.ui.isDirty = true;
        }
    },

    removeEdge: (state, action: PayloadAction<string>) => {
        state.workflow.edges = state.workflow.edges.filter(
          (e) => e.id !== action.payload,
        );
        state.ui.isDirty = true;
    },

    removeNode: (state, action: PayloadAction<string>) => {
        const id = action.payload;
        state.workflow.nodes = state.workflow.nodes.filter((n) => n.id !== id);

        state.workflow.edges = state.workflow.edges.filter(
          (e) => e.source !== id && e.target !== id,
        );
        delete state.ui.nodePositions[id];
        state.ui.isDirty = true;
    },

    selectNode: (state, action: PayloadAction<string | null>) => {
        state.ui.selectedNodeId = action.payload;
    },
  },
});
