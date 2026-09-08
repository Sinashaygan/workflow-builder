"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, RefreshCcw, Square, StepForward } from "lucide-react";
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

const STEP_PAUSE_MS = 350;

function isTerminalStep(step: ExecutionStep) {
  return ["reach_end", "finished", "failed"].includes(step.kind);
}

export function ExecutionPanel() {
  const dispatch = useAppDispatch();
  const { workflow } = useAppSelector((state) => state.workflow);
  const runnerRef = useRef<StepRunner | null>(null);
  const activeNodeRef = useRef<{
    id: string;
    startedAt: number;
  } | null>(null);
  const isRunningRef = useRef(false);
  const cancelRef = useRef(false);
  const isMountedRef = useRef(true);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pauseResolveRef = useRef<(() => void) | null>(null);
  const [isAutoRunning, setIsAutoRunning] = useState(false);

  const cancelPendingPause = useCallback(() => {
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }

    const resolvePause = pauseResolveRef.current;
    pauseResolveRef.current = null;
    resolvePause?.();
  }, []);

  const waitForPause = useCallback(
    (durationMs: number) =>
      new Promise<void>((resolve) => {
        if (cancelRef.current) {
          resolve();
          return;
        }

        pauseResolveRef.current = resolve;
        pauseTimerRef.current = setTimeout(() => {
          pauseTimerRef.current = null;
          pauseResolveRef.current = null;
          resolve();
        }, durationMs);
      }),
    [],
  );

  const finishRunner = useCallback(() => {
    runnerRef.current = null;
    activeNodeRef.current = null;
  }, []);

  const handleStepAction = useCallback(
    (step: ExecutionStep) => {
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
                message: `Waiting ${step.durationMs}ms on "${step.node.label}"`,
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

  const runAllSteps = useCallback(
    async (runner: StepRunner) => {
      if (isRunningRef.current) {
        return;
      }

      isRunningRef.current = true;
      cancelRef.current = false;
      setIsAutoRunning(true);

      try {
        let result = runner.next();

        while (!result.done) {
          if (cancelRef.current) {
            break;
          }

          const step = result.value;
          handleStepAction(step);

          if (isTerminalStep(step)) {
            break;
          }

          await waitForPause(
            step.kind === "execute_delay"
              ? step.durationMs
              : STEP_PAUSE_MS,
          );

          if (!cancelRef.current) {
            result = runner.next();
          }
        }
      } finally {
        isRunningRef.current = false;
        finishRunner();
        if (isMountedRef.current) {
          setIsAutoRunning(false);
        }
      }
    },
    [finishRunner, handleStepAction, waitForPause],
  );

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      cancelRef.current = true;
      isRunningRef.current = false;
      runnerRef.current = null;
      activeNodeRef.current = null;
      cancelPendingPause();
    };
  }, [cancelPendingPause]);

  const initializeExecution = useCallback((): StepRunner | null => {
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
      return null;
    }

    const rootNode = workflow.nodes.find((node) => node.type === "start");
    if (!rootNode) {
      dispatch(updateStatus({ status: "failed" }));
      finishRunner();
      return null;
    }

    const context = buildExecutionContext(workflow.nodes, workflow.edges);
    const newRunner = createStepRunner(context);
    runnerRef.current = newRunner;

    dispatch(
      startExecution({
        executionId: crypto.randomUUID(),
        rootNodeId: rootNode.id,
      }),
    );

    return newRunner;
  }, [dispatch, finishRunner, workflow.edges, workflow.nodes]);

  const handleRun = () => {
    if (isRunningRef.current) {
      return;
    }

    const activeRunner = runnerRef.current ?? initializeExecution();
    if (activeRunner) {
      void runAllSteps(activeRunner);
    }
  };

  const handleStep = () => {
    if (isRunningRef.current) {
      return;
    }

    const activeRunner = runnerRef.current ?? initializeExecution();
    if (!activeRunner) {
      return;
    }

    const result = activeRunner.next();
    if (result.done) {
      finishRunner();
      return;
    }

    handleStepAction(result.value);
  };

  const handleStopOrReset = () => {
    cancelRef.current = true;
    cancelPendingPause();

    if (isRunningRef.current) {
      finishRunner();
      dispatch(updateStatus({ status: "stopped" }));
      return;
    }

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
        disabled={workflow.nodes.length === 0 || isAutoRunning}
        aria-label="Start workflow execution"
      >
        <Play className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={handleStep}
        className="h-8 w-8"
        disabled={workflow.nodes.length === 0 || isAutoRunning}
        aria-label="Execute next workflow step"
      >
        <StepForward className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        onClick={handleStopOrReset}
        className="h-8 w-8"
        aria-label={
          isAutoRunning ? "Stop workflow execution" : "Reset workflow execution"
        }
      >
        {isAutoRunning ? (
          <Square className="h-4 w-4" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
