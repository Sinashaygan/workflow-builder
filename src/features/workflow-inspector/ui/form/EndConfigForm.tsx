"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import {
  EndNodeConfigSchema,
  type EndNodeConfig,
} from "@/entities/workflow/model";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Props {
  initialConfig: EndNodeConfig;
  onChange: (config: EndNodeConfig) => void;
}

export function EndConfigForm({ initialConfig, onChange }: Props) {
  const { register, handleSubmit, reset } = useForm<
    z.input<typeof EndNodeConfigSchema>,
    unknown,
    EndNodeConfig
  >({
    resolver: zodResolver(EndNodeConfigSchema),
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
        <Label htmlFor="status">Final Status</Label>
        <select
          id="status"
          {...register("status")}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="terminated">Terminated</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Closing Message (Optional)</Label>
        <Input
          id="message"
          placeholder="Workflow finished successfully"
          {...register("message")}
        />
      </div>
    </form>
  );
}
