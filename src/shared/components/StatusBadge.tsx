import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

export type StatusBadgeTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral";

type StatusBadgeProps = {
  children: ReactNode;
  tone?: StatusBadgeTone;
  className?: string;
};

const toneClasses: Record<StatusBadgeTone, string> = {
  success:
    "border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  warning:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  danger:
    "border-red-500/25 bg-red-500/10 text-red-700 dark:text-red-300",
  info:
    "border-sky-500/25 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  neutral:
    "border-border/70 bg-muted/50 text-muted-foreground"
};

export function StatusBadge({
  children,
  tone = "neutral",
  className
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold leading-none",
        toneClasses[tone] ?? toneClasses.neutral,
        className
      )}
    >
      {children}
    </span>
  );
}
