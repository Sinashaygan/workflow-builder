import { NodeType } from "@/entities/workflow/model";

export const connectionRules: Record<NodeType, NodeType[]> = {
  start: ["action", "condition", "delay", "end"],
  action: ["action", "condition", "delay", "end"],
  condition: ["condition", "delay", "end", "action"],
  delay: ["action", "condition", "end"],
  end: [],
};