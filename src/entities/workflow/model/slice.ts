import z from "zod";
import { ActionNodeConfigSchema, ConditionNodeConfigSchema, DelayNodeConfigSchema, EndNodeConfigSchema, NodeTypeSchema, StartNodeConfigSchema, WorkflowEdgeSchema, WorkflowNodeSchema, WorkflowSchema } from "./schemas";

export type NodeType = z.infer<typeof NodeTypeSchema>;
export type WorkflowNode = z.infer<typeof WorkflowNodeSchema>;
export type WorkflowEdge = z.infer<typeof WorkflowEdgeSchema>;
export type Workflow = z.infer<typeof WorkflowSchema>;

export type StartNodeConfig = z.infer<typeof StartNodeConfigSchema>;
export type ActionNodeConfig = z.infer<typeof ActionNodeConfigSchema>;
export type ConditionNodeConfig = z.infer<typeof ConditionNodeConfigSchema>;
export type DelayNodeConfig = z.infer<typeof DelayNodeConfigSchema>;
export type EndNodeConfig = z.infer<typeof EndNodeConfigSchema>;
