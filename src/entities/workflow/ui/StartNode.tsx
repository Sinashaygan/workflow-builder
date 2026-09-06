import { Handle, NodeProps, Position } from "@xyflow/react";
import { StartNodeConfig } from "../model";
import { BaseNode } from "./BaseNode";
import { Play } from "lucide-react";

export function StartNode({ data, selected }: NodeProps) {
  const config = data.config as StartNodeConfig;

  return (
    <BaseNode
      title={(data.label as string) || "Start Trigger"}
      icon={<Play className="w-3.5 h-3.5 text-emerald-500" />}
      badge="Start"
      selected={selected}
    >
      <div className="flex flex-col gap-1">
        <span className="text-[11px] text-muted-foreground">Trigger:</span>
        <span className="font-mono text-xs font-semibold uppercase text-foreground">
          {config?.triggerType || "manual"}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-emerald-500 !border-2 !border-background"
      />
    </BaseNode>
  );
}