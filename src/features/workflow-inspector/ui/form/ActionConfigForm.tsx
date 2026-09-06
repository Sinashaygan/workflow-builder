"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import {
  ActionNodeConfigSchema,
  type ActionNodeConfig,
} from "@/entities/workflow/model";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
  initialConfig: ActionNodeConfig;
  onChange: (config: ActionNodeConfig) => void;
}

export function ActionConfigForm({ initialConfig, onChange }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<
    z.input<typeof ActionNodeConfigSchema>,
    unknown,
    ActionNodeConfig
  >({
    resolver: zodResolver(ActionNodeConfigSchema),
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
        <Label htmlFor="actionType">Action Type</Label>
        <select
          id="actionType"
          {...register("actionType")}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="send_email">Send Email</option>
          <option value="http_request">HTTP Request</option>
          <option value="notification">Push Notification</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="endpoint">Endpoint URL</Label>
        <Input
          id="endpoint"
          placeholder="https://api.example.com/v1"
          {...register("endpoint")}
        />
        {errors.endpoint && (
          <span className="text-[11px] text-destructive">
            {errors.endpoint.message}
          </span>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="retryCount">Retry Count (0 - 5)</Label>
        <Input
          id="retryCount"
          type="number"
          min={0}
          max={5}
          {...register("retryCount", { valueAsNumber: true })}
        />
        {errors.retryCount && (
          <span className="text-[11px] text-destructive">
            {errors.retryCount.message}
          </span>
        )}
      </div>
    </form>
  );
}
