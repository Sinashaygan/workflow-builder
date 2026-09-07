"use client";

import { type LucideIcon } from "lucide-react";
import type { NodeType } from "@/entities/workflow/model";

interface Props {
  type: NodeType;
  label: string;
  icon: LucideIcon;
  colorClass: string;
  onClick: () => void;
}

export function DraggableNodeItem({
  type,
  label,
  icon: Icon,
  colorClass,
  onClick,
}: Props) {
  const onDragStart = (event: React.DragEvent) => {
    // ارسال تایپ نود از طریق dataTransfer در رویداد درگ HTML5
    event.dataTransfer.setData("application/reactflow-nodetype", type);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-border bg-card/80 hover:bg-accent/60 hover:border-primary/40 cursor-grab active:cursor-grabbing transition-all text-xs font-medium text-foreground select-none shadow-sm"
      title="Drag onto canvas or click to add"
    >
      <div className={`p-1.5 rounded-md ${colorClass} bg-opacity-10`}>
        <Icon className={`w-3.5 h-3.5 ${colorClass.replace("bg-", "text-")}`} />
      </div>
      <span>{label}</span>
    </div>
  );
}
