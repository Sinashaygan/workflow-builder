import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  ExecutionStatus,
  ExecutionLogEntry,
  NodeExecutionStatus,
} from "@/features/workflow-execution/model/types";

interface ExecutionState {
  status: ExecutionStatus;
  nodeStatuses: Record<string, NodeExecutionStatus>; 
  nodeStartTimes: Record<string, number>; 
  nodeDurations: Record<string, number>; 
  enteredEdges: string[]; 
  logs: ExecutionLogEntry[]; 
  logsClearedAt: number | null;
  currentCursor: string | null; 
  executionId: string | null;
}

const initialState: ExecutionState = {
  status: "idle",
  nodeStatuses: {},
  nodeStartTimes: {},
  nodeDurations: {},
  enteredEdges: [],
  logs: [],
  logsClearedAt: null,
  currentCursor: null,
  executionId: null,
};

const executionSlice = createSlice({
  name: "workflowExecution",
  initialState,
  reducers: {
    prepareExecution(state) {
      state.status = "ready";
      state.nodeStatuses = {};
      state.nodeStartTimes = {};
      state.nodeDurations = {};
      state.enteredEdges = [];
      state.currentCursor = null;
    },

    startExecution(
      state,
      action: PayloadAction<{ executionId: string; rootNodeId: string }>,
    ) {
      state.status = "running";
      state.executionId = action.payload.executionId;
      state.currentCursor = action.payload.rootNodeId;
      state.nodeStatuses[action.payload.rootNodeId] = "running";
    },

    markNodeStarted(
      state,
      action: PayloadAction<{ nodeId: string; at: number }>,
    ) {
      state.nodeStatuses[action.payload.nodeId] = "running";
      state.nodeStartTimes[action.payload.nodeId] = action.payload.at;
    },

    markNodeDone(
      state,
      action: PayloadAction<{ nodeId: string; duration: number }>,
    ) {
      state.nodeStatuses[action.payload.nodeId] = "executed";
      state.nodeDurations[action.payload.nodeId] = action.payload.duration;
    },

    markNodeSkipped(state, action: PayloadAction<{ nodeId: string }>) {
      state.nodeStatuses[action.payload.nodeId] = "skipped";
    },

    markNodeFailed(state, action: PayloadAction<{ nodeId: string }>) {
      state.nodeStatuses[action.payload.nodeId] = "error";
      state.status = "failed";
    },

    advanceCursor(state, action: PayloadAction<{ nodeId: string }>) {
      state.currentCursor = action.payload.nodeId;
      state.nodeStatuses[action.payload.nodeId] = "running";
    },

    addEnteredEdge(state, action: PayloadAction<{ edgeId: string }>) {
      if (!state.enteredEdges.includes(action.payload.edgeId)) {
        state.enteredEdges.push(action.payload.edgeId);
      }
    },

    appendLog(state, action: PayloadAction<{ entry: ExecutionLogEntry }>) {
      state.logs.push(action.payload.entry);
    },

    updateStatus(state, action: PayloadAction<{ status: ExecutionStatus }>) {
      state.status = action.payload.status;
    },

    clearExecution(state) {
      state.status = "idle";
      state.nodeStatuses = {};
      state.nodeStartTimes = {};
      state.nodeDurations = {};
      state.enteredEdges = [];
      state.currentCursor = null;
      state.executionId = null;
      state.logs = [];
    },
  },
});

export const {
  prepareExecution,
  startExecution,
  markNodeStarted,
  markNodeDone,
  markNodeSkipped,
  markNodeFailed,
  advanceCursor,
  addEnteredEdge,
  appendLog,
  updateStatus,
  clearExecution,
} = executionSlice.actions;

export default executionSlice.reducer;
