"use client";

import { Play, Zap, GitBranch, Clock, Square } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import {
  addNode,
  type NodeType,
} from "@/entities/workflow/model";
import { DraggableNodeItem } from "./DraggableNodeItem";
import { AutoLayoutButton } from "@/features/workflow-layout/ui/AutoLayoutButton";
import { Separator } from "@/components/ui/separator";
import { useAppDispatch } from "@/shared/lib/hooks";
import { createDefaultNode } from "../utils/creat-default-nodes";

export function WorkflowToolbar() {
  const dispatch = useAppDispatch();
  const { screenToFlowPosition } = useReactFlow();

  const handleAddCenter = (type: NodeType) => {
    const centerPosition = screenToFlowPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const payload = createDefaultNode(type, centerPosition);
    dispatch(addNode(payload));
  };

  return (
    <div className="absolute top-4 left-4 z-20 flex flex-col gap-2 rounded-xl border border-border bg-card/95 p-2 shadow-xl backdrop-blur-sm">
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Add Nodes
        </span>
        <AutoLayoutButton />
      </div>

      <Separator />

      <div className="flex flex-col gap-1.5 w-44">
        <DraggableNodeItem
          type="start"
          label="Start Node"
          icon={Play}
          colorClass="bg-emerald-500"
          onClick={() => handleAddCenter("start")}
        />
        <DraggableNodeItem
          type="action"
          label="Action Node"
          icon={Zap}
          colorClass="bg-blue-500"
          onClick={() => handleAddCenter("action")}
        />
        <DraggableNodeItem
          type="condition"
          label="Condition Node"
          icon={GitBranch}
          colorClass="bg-amber-500"
          onClick={() => handleAddCenter("condition")}
        />
        <DraggableNodeItem
          type="delay"
          label="Delay Node"
          icon={Clock}
          colorClass="bg-purple-500"
          onClick={() => handleAddCenter("delay")}
        />
        <DraggableNodeItem
          type="end"
          label="End Node"
          icon={Square}
          colorClass="bg-rose-500"
          onClick={() => handleAddCenter("end")}
        />
      </div>
    </div>
  );
}