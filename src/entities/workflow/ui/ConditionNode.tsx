"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { GitBranch } from "lucide-react";
import { BaseNode } from "./BaseNode";
import type { ConditionNodeConfig } from "../model";

export function ConditionNode({ data, selected }: NodeProps) {
  const config = data.config as ConditionNodeConfig;

  return (
    <BaseNode
      title={(data.label as string) || "Condition"}
      icon={<GitBranch className="w-3.5 h-3.5 text-amber-500" />}
      badge="Branch"
      selected={selected}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background"
      />

      <div className="flex flex-col gap-1 text-[11px]">
        <span>
          <b className="text-foreground">{config?.field || "field"}</b>{" "}
          {config?.operator || "=="}{" "}
          <b className="text-foreground">{String(config?.value ?? "")}</b>
        </span>
      </div>

      {/* دو هندل خروجی برای وضعیت‌های True و False */}
      <div className="mt-3 flex justify-between text-[10px] font-bold">
        <div className="relative text-emerald-500">
          True
          <Handle
            id="true"
            type="source"
            position={Position.Bottom}
            className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-background !left-2"
          />
        </div>
        <div className="relative text-rose-500">
          False
          <Handle
            id="false"
            type="source"
            position={Position.Bottom}
            className="!w-3 !h-3 !bg-rose-500 !border-2 !border-background !right-2"
          />
        </div>
      </div>
    </BaseNode>
  );
}
