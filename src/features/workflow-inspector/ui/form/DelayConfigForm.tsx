"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import {
  DelayNodeConfigSchema,
  type DelayNodeConfig,
} from "@/entities/workflow/model";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
  initialConfig: DelayNodeConfig;
  onChange: (config: DelayNodeConfig) => void;
}

export function DelayConfigForm({ initialConfig, onChange }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof DelayNodeConfigSchema>, unknown, DelayNodeConfig>({
    resolver: zodResolver(DelayNodeConfigSchema),
    defaultValues: initialConfig,
  });

  useEffect(() => {
    reset(initialConfig);
  }, [initialConfig, reset]);

  const submit = handleSubmit(onChange);
  return (
    <form
      onSubmit={submit}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          void submit();
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1.5">
          <Label htmlFor="durationMs">Duration</Label>
          <Input
            id="durationMs"
            type="number"
            min={1}
            {...register("durationMs", { valueAsNumber: true })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="unit">Unit</Label>
          <select
            id="unit"
            {...register("unit")}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="seconds">Seconds</option>
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
          </select>
        </div>
      </div>
      {errors.durationMs && (
        <span className="text-[11px] text-destructive">
          {errors.durationMs.message}
        </span>
      )}
    </form>
  );
}
