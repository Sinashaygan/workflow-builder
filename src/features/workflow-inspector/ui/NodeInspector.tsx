"use client";

import React from "react";
import { X, Trash2 } from "lucide-react";
import {
  selectNode,
  removeNode,
  updateNodeConfig,
} from "@/entities/workflow/model";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks";
import { Button } from "@/components/ui/button";
import { ActionConfigForm, ConditionConfigForm, DelayConfigForm, EndConfigForm, StartConfigForm } from "./form";

export function NodeInspector() {
  const dispatch = useAppDispatch();
  const { workflow, ui } = useAppSelector((state) => state.workflow);

  const selectedNode = workflow.nodes.find((n) => n.id === ui.selectedNodeId);

  if (!selectedNode) return null;

  const handleConfigChange = (newConfig: unknown) => {
    dispatch(
      updateNodeConfig({
        id: selectedNode.id,
        config: newConfig,
      }),
    );
  };

  const handleClose = () => {
    dispatch(selectNode(null));
  };

  const handleDelete = () => {
    dispatch(removeNode(selectedNode.id));
    dispatch(selectNode(null));
  };

  return (
    <aside className="absolute top-4 right-4 z-20 w-80 rounded-xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur-sm transition-all duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {selectedNode.label || "Node Properties"}
          </h3>
          <span className="text-[11px] font-mono text-muted-foreground uppercase">
            {selectedNode.type} Node
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            className="h-7 w-7 text-destructive hover:bg-destructive/10"
            title="Delete Node"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="h-7 w-7 text-muted-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Dynamic Form Body */}
      <div className="max-h-[calc(100vh-250px)] overflow-y-auto pr-1">
        {selectedNode.type === "start" && (
          <StartConfigForm
            initialConfig={selectedNode.config}
            onChange={handleConfigChange}
          />
        )}
        {selectedNode.type === "action" && (
          <ActionConfigForm
            initialConfig={selectedNode.config}
            onChange={handleConfigChange}
          />
        )}
        {selectedNode.type === "condition" && (
          <ConditionConfigForm
            initialConfig={selectedNode.config}
            onChange={handleConfigChange}
          />
        )}
        {selectedNode.type === "delay" && (
          <DelayConfigForm
            initialConfig={selectedNode.config}
            onChange={handleConfigChange}
          />
        )}
        {selectedNode.type === "end" && (
          <EndConfigForm
            initialConfig={selectedNode.config}
            onChange={handleConfigChange}
          />
        )}
      </div>
    </aside>
  );
}
