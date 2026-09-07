import {
  WorkflowEdge,
  WorkflowNode,
} from "@/entities/workflow/model";
import { GraphIssue } from "./types";
import { connectionRules } from "@/shared/lib/connections";
import { validateNodeConfig } from "./validateNodeConfig";
import { findCycles } from "./findCycle";

export interface ValidationResult {
  isValid: boolean;
  issues: GraphIssue[];
}

export function validateWorkflowGraph(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): ValidationResult {
  const issues: GraphIssue[] = [];

  if (nodes.length === 0) {
    issues.push({
      severity: "error",
      message: "Workflow is empty. Add at least a Start and an End node.",
    });
  }

  const startNodes = nodes.filter((n) => n.type === "start");
  const endNodes = nodes.filter((n) => n.type === "end");

  // ۱. باید دقیقاً یک Start وجود داشته باشد
  if (startNodes.length === 0) {
    issues.push({ severity: "error", message: "Missing a Start node." });
  } else if (startNodes.length > 1) {
    issues.push({
      severity: "warning",
      message: `Multiple Start nodes found (${startNodes.length}). Only the first will be used.`,
    });
    for (const n of startNodes.slice(1)) {
      issues.push({
        severity: "error",
        message: `Extra Start node "${n.label}".`,
        nodeId: n.id,
      });
    }
  }

  // ۲. باید حداقل یک End وجود داشته باشد
  if (endNodes.length === 0) {
    issues.push({ severity: "error", message: "Missing an End node." });
  }

  // ۳. اعتبارسنجی اتصال‌ها مطابق قوانین
  for (const edge of edges) {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);

    if (!sourceNode || !targetNode) {
      issues.push({
        severity: "error",
        message: "Edge references an unknown node.",
      });
      continue;
    }

    const allowedTargets = connectionRules[sourceNode.type] ?? [];
    if (!allowedTargets.includes(targetNode.type)) {
      issues.push({
        severity: "error",
        message: `Cannot connect ${sourceNode.type} → ${targetNode.type}.`,
        nodeId: sourceNode.id,
      });
    }

    // ضمان یال غیرمعتبر (برای دروان)
    if (edge.source === edge.target) {
      issues.push({
        severity: "error",
        message: `Self-loop detected on node "${sourceNode.label}".`,
        nodeId: sourceNode.id,
      });
    }
  }

  // ۴. اعتبارسنجی Config اختصاصی هر نود
  for (const node of nodes) {
    const configIssues = validateNodeConfig(node);
    issues.push(
      ...configIssues.map((msg) => ({
        severity: "error" as const,
        message: msg,
        nodeId: node.id,
      })),
    );
  }

  // ۵. آشکارسازی دروان‌ها در گراف (DFS + رنگ کردن)
  const cycleNodes = findCycles(nodes, edges);
  if (cycleNodes.length > 0) {
    issues.push({
      severity: "error",
      message: `Cycle detected involving: ${cycleNodes.join(", ")}. Workflows must be acyclic.`,
    });
  }

  return {
    isValid: !issues.some((i) => i.severity === "error"),
    issues,
  };
}
