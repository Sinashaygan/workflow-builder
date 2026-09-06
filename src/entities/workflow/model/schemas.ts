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
  endpoint: z.string().url().optional(),
  payload: z.record(z.string() , z.unknown()).optional(),
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