"use client";

import React from "react";
import { twMerge } from "tailwind-merge";

interface BaseNodeProps {
  title: string;
  icon?: React.ReactNode;
  badge?: string;
  selected?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function BaseNode({
  title,
  icon,
  badge,
  selected,
  className,
  children,
}: BaseNodeProps) {
  return (
    <div
      className={twMerge(
        "w-64 rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-200",
        selected
          ? "border-primary ring-2 ring-primary/20 shadow-md"
          : "border-border hover:border-muted-foreground/30",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-3 py-2 bg-muted/20 rounded-t-xl">
        <div className="flex items-center gap-2">
          {icon && (
            <span className="text-muted-foreground text-sm">{icon}</span>
          )}
          <span className="font-medium text-xs text-foreground tracking-tight">
            {title}
          </span>
        </div>
        {badge && (
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
            {badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-3 text-xs text-muted-foreground">{children}</div>
    </div>
  );
}
