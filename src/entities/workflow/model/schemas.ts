import z from "zod";

export const NodeTypeSchema = z.enum([
  "start",
  "action",
  "condition",
  "delay",
  "end",
]);

export const StartNodeConfigSchema = z.object({});

export const ActionNodeConfigSchema = z.object({});

export const ConditionNodeConfigSchema = z.object({});

export const DelayNodeConfigSchema = z.object({});

export const EndNodeConfigSchema = z.object({});