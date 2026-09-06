import z from "zod";

export const NodeTypeSchema = z.enum([
  "start",
  "action",
  "condition",
  "delay",
  "end",
]);
