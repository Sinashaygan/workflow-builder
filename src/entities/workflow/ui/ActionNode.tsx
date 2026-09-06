"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Zap } from "lucide-react";
import { BaseNode } from "./BaseNode";
import type { ActionNodeConfig } from "../model";

export function ActionNode({ data, selected }: NodeProps) {
  const config = data.config as ActionNodeConfig;

  return (
    <BaseNode
      title={(data.label as string) || "Action"}
      icon={<Zap className="w-3.5 h-3.5 text-blue-500" />}
      badge="Action"
      selected={selected}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background"
      />

      <div className="flex flex-col gap-1">
        <span className="font-mono text-xs text-foreground">
          {config?.actionType || "http_request"}
        </span>
        {config?.endpoint && (
          <span className="truncate text-[10px] text-muted-foreground">
            {config.endpoint}
          </span>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-background"
      />
    </BaseNode>
  );
}
