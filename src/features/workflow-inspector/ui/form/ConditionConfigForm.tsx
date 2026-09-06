"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ConditionNodeConfigSchema,
  type ConditionNodeConfig,
} from "@/entities/workflow/model";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
  initialConfig: ConditionNodeConfig;
  onChange: (config: ConditionNodeConfig) => void;
}

export function ConditionConfigForm({ initialConfig, onChange }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ConditionNodeConfig>({
    resolver: zodResolver(ConditionNodeConfigSchema),
    defaultValues: initialConfig,
  });

  useEffect(() => {
    reset(initialConfig);
  }, [initialConfig, reset]);

  return (
    <form onBlur={handleSubmit(onChange)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="field">Field Variable</Label>
        <Input
          id="field"
          placeholder="e.g. payload.status"
          {...register("field")}
        />
        {errors.field && (
          <span className="text-[11px] text-destructive">
            {errors.field.message}
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="operator">Operator</Label>
        <select
          id="operator"
          {...register("operator")}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="equals">Equals (==)</option>
          <option value="not_equals">Not Equals (!=)</option>
          <option value="greater_than">Greater Than (&gt;)</option>
          <option value="less_than">Less Than (&lt;)</option>
          <option value="contains">Contains</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="value">Comparison Value</Label>
        <Input
          id="value"
          placeholder="e.g. active / 100"
          {...register("value")}
        />
      </div>
    </form>
  );
}
