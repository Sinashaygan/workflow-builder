"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Clock } from "lucide-react";
import { BaseNode } from "./BaseNode";
import type { DelayNodeConfig } from "../model";

export function DelayNode({ id, data, selected }: NodeProps) {
  const config = data.config as DelayNodeConfig;

  return (
    <BaseNode
      nodeId={id}
      title={(data.label as string) || "Delay"}
      icon={<Clock className="w-3.5 h-3.5 text-purple-500" />}
      badge="Delay"
      selected={selected}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background"
      />

      <div className="text-center font-mono text-xs text-foreground">
        Wait {config?.durationMs ?? 1000} {config?.unit ?? "seconds"}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-background"
      />
    </BaseNode>
  );
}
