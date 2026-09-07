import { useAppSelector } from "@/shared/lib/hooks";
import type {
  ExecutionStatus,
  NodeExecutionStatus,
} from "@/features/workflow-execution/model/types";

export interface UseNodeExecutionStatusResult {
  status: NodeExecutionStatus;
  executionStatus: ExecutionStatus;
  label: string;
  indicatorClass: string;
  hasError: boolean;
  isRunning: boolean;
  isFinished: boolean;
}

const STATUS_META: Record<
  NodeExecutionStatus,
  { label: string; className: string }
> = {
  pending: { label: "Pending", className: "bg-gray-100 text-gray-500" },
  running: { label: "Running", className: "bg-yellow-100 text-yellow-700" },
  executed: { label: "Completed", className: "bg-green-100 text-green-700" },
  skipped: { label: "Skipped", className: "bg-blue-100 text-blue-700" },
  error: { label: "Error", className: "bg-red-100 text-red-700" },
  active: { label: "Active", className: "bg-yellow-100 text-yellow-700" },
};

export function useNodeExecutionStatus(
  nodeId: string,
): UseNodeExecutionStatusResult {
  const nodeStatus = useAppSelector(
    (state) => state.execution.nodeStatuses[nodeId] ?? "pending",
  );

  const executionStatus = useAppSelector((state) => state.execution.status);

  const isRunning = nodeStatus === "running" || nodeStatus === "active";
  const isFinished =
    nodeStatus === "executed" ||
    nodeStatus === "error" ||
    nodeStatus === "skipped";
  const hasError = nodeStatus === "error";

  const meta = STATUS_META[nodeStatus];

  return {
    status: nodeStatus,
    executionStatus,
    label: meta.label,
    indicatorClass: meta.className,
    hasError,
    isRunning,
    isFinished,
  };
}
