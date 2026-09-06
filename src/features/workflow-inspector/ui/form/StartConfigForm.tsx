"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import {
  StartNodeConfigSchema,
  type StartNodeConfig,
} from "@/entities/workflow/model";
import { Label } from "@/components/ui/label";

interface Props {
  initialConfig: StartNodeConfig;
  onChange: (config: StartNodeConfig) => void;
}

export function StartConfigForm({ initialConfig, onChange }: Props) {
  const { register, handleSubmit, reset } = useForm<
    z.input<typeof StartNodeConfigSchema>,
    unknown,
    StartNodeConfig
  >({
    resolver: zodResolver(StartNodeConfigSchema),
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
      <div className="space-y-1.5">
        <Label htmlFor="triggerType">Trigger Type</Label>
        <select
          id="triggerType"
          {...register("triggerType")}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="manual">Manual (User Click)</option>
          <option value="webhook">Webhook Endpoint</option>
          <option value="schedule">CRON Schedule</option>
        </select>
      </div>
    </form>
  );
}
