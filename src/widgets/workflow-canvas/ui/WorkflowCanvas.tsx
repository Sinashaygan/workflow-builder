"use client";

import { useMemo, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type OnNodesChange,
  type OnEdgesChange,
  type Connection,
  applyNodeChanges,
  applyEdgeChanges,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { workflowNodeTypes } from "@/entities/workflow/ui/nodeTypes";
import {
  toReactFlowNode,
  toReactFlowEdge,
} from "@/entities/workflow/model/adapter";
import {
  addEdge,
  removeEdge,
  removeNode,
  updateNodePosition,
  selectNode,
  NodeType,
  addNode,
} from "@/entities/workflow/model";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks";
import { createDefaultNode } from "@/features/workflow-toolbar/utils/creat-default-nodes";

export function WorkflowCanvas() {
  const dispatch = useAppDispatch();
  const { workflow, ui } = useAppSelector((state) => state.workflow);
  const {screenToFlowPosition} = useReactFlow()

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData(
        "application/reactflow-nodetype",
      ) as NodeType;

      if (!type) return;
      
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const payload = createDefaultNode(type, position);
      dispatch(addNode(payload));
    },
    [dispatch, screenToFlowPosition],
  );

  // تبدیل داده‌های Domain به نودها و یال‌های React Flow
  const nodes = useMemo(() => {
    return workflow.nodes.map((node) =>
      toReactFlowNode(node, ui.nodePositions[node.id] || { x: 0, y: 0 }),
    );
  }, [workflow.nodes, ui.nodePositions]);

  const edges = useMemo(() => {
    return workflow.edges.map(toReactFlowEdge);
  }, [workflow.edges]);

  // رویدادهای تغییر پوزیشن یا حذف از طرف React Flow
  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      changes.forEach((change) => {
        if (change.type === "position" && change.position) {
          dispatch(
            updateNodePosition({
              id: change.id,
              position: change.position,
            }),
          );
        } else if (change.type === "remove") {
          dispatch(removeNode(change.id));
        } else if (change.type === "select") {
          dispatch(selectNode(change.selected ? change.id : null));
        }
      });
    },
    [dispatch],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => {
      changes.forEach((change) => {
        if (change.type === "remove") {
          dispatch(removeEdge(change.id));
        }
      });
    },
    [dispatch],
  );

  // ایجاد اتصال جدید با اعتبارسنجی Redux
  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;
      dispatch(
        addEdge({
          id: crypto.randomUUID(),
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle ?? null,
          targetHandle: connection.targetHandle ?? null,
        }),
      );
    },
    [dispatch],
  );

  return (
    <div className="w-full h-full bg-background relative" onDragOver={onDragOver} onDrop={onDrop}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={workflowNodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onPaneClick={() => dispatch(selectNode(null))}
        fitView
      >
        <Background gap={16} size={1} />
        <Controls className="bg-card border-border fill-foreground" />
        <MiniMap className="bg-card border-border" />
      </ReactFlow>
    </div>
  );
}
