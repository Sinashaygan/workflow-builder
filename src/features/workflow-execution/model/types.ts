export type ExecutionStatus =
  | "idle"
  | "ready"
  | "running"
  | "paused"
  | "completed"
  | "failed"
  | "stopped";

export type ExecutionLogEntry =
  | { type: "info"; message: string; timestamp: number; nodeId?: string }
  | { type: "success"; message: string; timestamp: number; nodeId?: string }
  | { type: "warning"; message: string; timestamp: number; nodeId?: string }
  | { type: "error"; message: string; timestamp: number; nodeId?: string };

export type NodeExecutionStatus =
  | "pending"
  | "running"
  | "executed"
  | "skipped"
  | "error"
  | "active";
