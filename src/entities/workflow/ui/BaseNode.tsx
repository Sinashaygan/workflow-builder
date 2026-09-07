"use client";

import { twMerge } from "tailwind-merge";
import { useNodeExecutionStatus } from "../hook/useNodeExecutionStatus";

interface BaseNodeProps {
  title: string;
  icon?: React.ReactNode;
  badge?: string;
  selected?: boolean;
  className?: string;
  children?: React.ReactNode;
  nodeId: string;
}

export function BaseNode({
  nodeId,
  title,
  icon,
  badge,
  selected,
  className,
  children,
}: BaseNodeProps) {
  const { status, indicatorClass, label } = useNodeExecutionStatus(nodeId);

  const statusBorderClass =
    status === "running" || status === "active"
      ? "border-yellow-500 animate-pulse"
      : status === "executed"
        ? "border-green-500"
        : status === "error"
          ? "border-red-500"
          : status === "pending"
            ? "border-gray-300"
            : "border-blue-500";

  return (
    <div
      className={twMerge(
        "relative w-64 rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200",
        statusBorderClass,
        selected ? "ring-2 ring-primary/20 shadow-md" : "hover:border-muted-foreground/30",
        className,
      )}
      data-execution-status={status}
    >
      <span
        className={twMerge(
          "absolute -right-1.5 -top-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-medium leading-none",
          indicatorClass,
        )}
        aria-label={`Execution status: ${label}`}
      >
        {label}
      </span>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-3 py-2 bg-muted/20 rounded-t-xl">
        <div className="flex items-center gap-2">
          {icon && (
            <span className="text-muted-foreground text-sm">{icon}</span>
          )}
          <span className="font-medium text-xs text-foreground tracking-tight">
            {title}
          </span>
        </div>
        {badge && (
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
            {badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3 text-xs text-muted-foreground">{children}</div>
    </div>
  );
}
