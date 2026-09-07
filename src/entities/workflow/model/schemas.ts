import z from "zod";

export const NodeTypeSchema = z.enum([
  "start",
  "action",
  "condition",
  "delay",
  "end",
]);

export const StartNodeConfigSchema = z.object({
  triggerType: z.enum(["manual", "webhook", "schedule"]).default("manual"),
});

export const ActionNodeConfigSchema = z.object({
  actionType: z.enum(["send_email", "http_request", "notification"]),
  endpoint: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().url().optional(),
  ),
  payload: z.record(z.string(), z.unknown()).optional(),
  retryCount: z.number().int().min(0).max(5).default(0),
});

export const ConditionNodeConfigSchema = z.object({
  field: z.string().min(1, "The conditional field is required"),
  operator: z.enum([
    "equals",
    "not_equals",
    "greater_than",
    "less_than",
    "contains",
  ]),
  value: z.union([z.string(), z.number(), z.boolean()]),
});

export const DelayNodeConfigSchema = z.object({
  durationMs: z.number().int().positive("Delay time should be more than zero"),
  unit: z.enum(["seconds", "minutes", "hours"]).default("seconds"),
});

export const EndNodeConfigSchema = z.object({
  status: z.enum(["success", "failed", "terminated"]).default("success"),
  message: z.string().optional(),
});

const BaseNodeSchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(1, "Node name is required"),
  description: z.string().optional(),
});

export const WorkflowNodeSchema = z.discriminatedUnion("type", [
  BaseNodeSchema.extend({
    type: z.literal(NodeTypeSchema.enum.start),
    config: StartNodeConfigSchema,
  }),
  BaseNodeSchema.extend({
    type: z.literal(NodeTypeSchema.enum.action),
    config: ActionNodeConfigSchema,
  }),
  BaseNodeSchema.extend({
    type: z.literal(NodeTypeSchema.enum.condition),
    config: ConditionNodeConfigSchema,
  }),
  BaseNodeSchema.extend({
    type: z.literal(NodeTypeSchema.enum.delay),
    config: DelayNodeConfigSchema,
  }),
  BaseNodeSchema.extend({
    type: z.literal(NodeTypeSchema.enum.end),
    config: EndNodeConfigSchema,
  }),
]);

export const WorkflowEdgeSchema = z.object({
  id: z.string().uuid(),
  source: z.string().uuid(),
  target: z.string().uuid(),
  sourceHandle: z.string().nullable().optional(),
  targetHandle: z.string().nullable().optional(),
  branch: z.enum(["true", "false"]).optional(),
});

export const WorkflowSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "workflow name is required"),
  version: z.number().int().positive().default(1),
  nodes: z.array(WorkflowNodeSchema),
  edges: z.array(WorkflowEdgeSchema),
  metadata: z.record(z.string() , z.unknown()).optional(),
});
