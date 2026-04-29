import type { ReactNode } from "react";

import { cn } from "@/shared/utils/cn";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "mb-6 flex flex-col gap-4 rounded-3xl border border-border/70 bg-card/80 p-5 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="break-words text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>

        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      {actions ? (
        <div
          aria-label="Ações da página"
          className="flex shrink-0 flex-wrap gap-2"
        >
          {actions}
        </div>
      ) : null}
    </header>
  );
}
