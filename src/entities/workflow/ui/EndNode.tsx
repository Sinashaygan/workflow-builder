"use client";

import React from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Square } from "lucide-react";
import { BaseNode } from "./BaseNode";
import type { EndNodeConfig } from "../model";

export function EndNode({ id, data, selected }: NodeProps) {
  const config = data.config as EndNodeConfig;

  return (
    <BaseNode
      nodeId={id}
      title={(data.label as string) || "End"}
      icon={<Square className="w-3.5 h-3.5 text-rose-500" />}
      badge="Terminal"
      selected={selected}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-rose-500 !border-2 !border-background"
      />

      <div className="text-center text-[11px] text-muted-foreground">
        Status:{" "}
        <span className="font-semibold text-foreground">
          {config?.status || "success"}
        </span>
      </div>
    </BaseNode>
  );
}
