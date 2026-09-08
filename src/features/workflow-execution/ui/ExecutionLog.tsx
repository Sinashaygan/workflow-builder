"use client"
import { useAppSelector } from "@/shared/lib/hooks";
import { ExecutionStatus } from "../model/types";

export function ExecutionLog() {
  const logs = useAppSelector((state) => state.execution.logs);
  const status = useAppSelector((state) => state.execution.status);

  const statusColor: Record<ExecutionStatus, string> = {
    idle: "text-muted-foreground",
    ready: "text-blue-500",
    running: "text-amber-500 animate-pulse",
    paused: "text-yellow-500",
    completed: "text-emerald-500",
    failed: "text-rose-500",
    stopped: "text-muted-foreground",
  };

  return (
    <div className="absolute bottom-4 left-4 z-20 w-72 h-48 rounded-lg border bg-card/95 shadow-xl overflow-y-auto">
      <div className="flex justify-between px-2.5 py-1.5 text-[10px] font-semibold uppercase text-muted-foreground">
        <span>Execution Log</span>
        <span className={`flex items-center gap-1 ${statusColor[status]}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {status}
        </span>
      </div>
      <div className="flex flex-col gap-1 px-2 py-1 font-mono text-[11px]">
        {logs.length === 0 && (
          <p className="text-muted-foreground italic">
            No logs yet. Press Run to start…
          </p>
        )}
        {logs
          .slice(-30)
          .reverse()
          .map((log) => (
            <div
              key={log.timestamp + log.message}
              className={`${
                (log.type === "error" && "text-rose-500") ||
                (log.type === "success" && "text-emerald-500") ||
                (log.type === "warning" && "text-amber-500") ||
                "text-muted-foreground"
              } text-[10px]`}
            >
              <span className="text-muted-foreground">
                [{new Date(log.timestamp).toLocaleTimeString()}]
              </span>{" "}
              {log.message}
            </div>
          ))}
      </div>
    </div>
  );
}
