"use client";

import React from "react";
import { Play, RefreshCcw, StepForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  appendLog,
  clearExecution,
  markNodeDone,
  markNodeFailed,
  markNodeStarted,
  prepareExecution,
  startExecution,
  updateStatus,
} from "@/entities/workflow-execution/model/executionSlice";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks";
import {
  buildExecutionContext,
  createStepRunner,
  type ExecutionStep,
} from "../model/executeGraph";
import { validateWorkflowGraph } from "../model/validateGraph";

type StepRunner = Generator<ExecutionStep, void, void>;

export function ExecutionPanel() {
  const dispatch = useAppDispatch();
  const { workflow } = useAppSelector((state) => state.workflow);
  const execution = useAppSelector((state) => state.execution);
  const runnerRef = React.useRef<StepRunner | null>(null);
  const activeNodeRef = React.useRef<{
    id: string;
    startedAt: number;
  } | null>(null);
  const [hasRunner, setHasRunner] = React.useState(false);

  const finishRunner = React.useCallback(() => {
    runnerRef.current = null;
    activeNodeRef.current = null;
    setHasRunner(false);
  }, []);

  const stepExecution = React.useCallback(
    (runnerOverride?: StepRunner) => {
      const activeRunner = runnerOverride ?? runnerRef.current;
      if (!activeRunner) {
        return;
      }

      const result = activeRunner.next();
      if (result.done) {
        finishRunner();
        return;
      }

      const step = result.value;
      switch (step.kind) {
        case "enter_node": {
          const now = Date.now();
          const previousNode = activeNodeRef.current;
          if (previousNode && previousNode.id !== step.node.id) {
            dispatch(
              markNodeDone({
                nodeId: previousNode.id,
                duration: now - previousNode.startedAt,
              }),
            );
          }

          activeNodeRef.current = { id: step.node.id, startedAt: now };
          dispatch(markNodeStarted({ nodeId: step.node.id, at: now }));
          break;
        }

        case "execute_action":
          dispatch(
            appendLog({
              entry: {
                type: "info",
                message: `Executing "${step.node.label}" (${step.node.config.actionType})`,
                nodeId: step.node.id,
                timestamp: Date.now(),
              },
            }),
          );
          break;

        case "execute_delay":
          dispatch(
            appendLog({
              entry: {
                type: "info",
                message: `Waiting ${step.ms}ms on "${step.node.label}"`,
                nodeId: step.node.id,
                timestamp: Date.now(),
              },
            }),
          );
          break;

        case "evaluate_condition":
          dispatch(
            appendLog({
              entry: {
                type: "info",
                message: `Evaluating condition on "${step.node.label}"`,
                nodeId: step.node.id,
                timestamp: Date.now(),
              },
            }),
          );
          break;

        case "choose_branch":
          dispatch(
            appendLog({
              entry: {
                type: step.branch === "fallthrough" ? "warning" : "info",
                message: `Choosing branch "${step.branch}"`,
                nodeId: step.nodeId,
                timestamp: Date.now(),
              },
            }),
          );
          break;

        case "reach_end": {
          const activeNode = activeNodeRef.current;
          dispatch(
            markNodeDone({
              nodeId: step.node.id,
              duration:
                activeNode?.id === step.node.id
                  ? Date.now() - activeNode.startedAt
                  : 0,
            }),
          );
          dispatch(updateStatus({ status: "completed" }));
          dispatch(
            appendLog({
              entry: {
                type: "success",
                message: `Workflow completed at "${step.node.label}"`,
                nodeId: step.node.id,
                timestamp: Date.now(),
              },
            }),
          );
          finishRunner();
          break;
        }

        case "finished":
          dispatch(updateStatus({ status: "completed" }));
          finishRunner();
          break;

        case "failed":
          if (step.nodeId) {
            dispatch(markNodeFailed({ nodeId: step.nodeId }));
          } else {
            dispatch(updateStatus({ status: "failed" }));
          }
          dispatch(
            appendLog({
              entry: {
                type: "error",
                message: step.reason,
                nodeId: step.nodeId,
                timestamp: Date.now(),
              },
            }),
          );
          finishRunner();
          break;
      }
    },
    [dispatch, finishRunner],
  );

  const handleRun = () => {
    const validation = validateWorkflowGraph(workflow.nodes, workflow.edges);

    dispatch(prepareExecution());

    if (!validation.isValid) {
      validation.issues
        .filter((issue) => issue.severity === "error")
        .forEach((issue) => {
          dispatch(
            appendLog({
              entry: {
                type: "error",
                message: `[Validation] ${issue.message}`,
                nodeId: issue.nodeId,
                timestamp: Date.now(),
              },
            }),
          );
        });
      dispatch(updateStatus({ status: "failed" }));
      finishRunner();
      return;
    }

    const rootNode = workflow.nodes.find((node) => node.type === "start");
    if (!rootNode) {
      dispatch(updateStatus({ status: "failed" }));
      finishRunner();
      return;
    }

    const context = buildExecutionContext(workflow.nodes, workflow.edges);
    const newRunner = createStepRunner(context);
    runnerRef.current = newRunner;
    setHasRunner(true);

    dispatch(
      startExecution({
        executionId: crypto.randomUUID(),
        rootNodeId: rootNode.id,
      }),
    );

    stepExecution(newRunner);
  };

  const handleReset = () => {
    finishRunner();
    dispatch(clearExecution());
  };

  return (
    <div className="absolute bottom-4 right-4 z-20 flex gap-2 rounded-xl border bg-card/95 shadow-xl">
      <Button
        size="icon"
        variant="outline"
        onClick={handleRun}
        className="h-8 w-8"
        disabled={workflow.nodes.length === 0 || execution.status === "running"}
        aria-label="Start workflow execution"
      >
        <Play className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={() => stepExecution()}
        className="h-8 w-8"
        disabled={!hasRunner || execution.status !== "running"}
        aria-label="Execute next workflow step"
      >
        <StepForward className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={handleReset}
        className="h-8 w-8"
        aria-label="Reset workflow execution"
      >
        <RefreshCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}
