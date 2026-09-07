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


