import type { ReactNode } from "react";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  actionDisabled = false,
  className
}: EmptyStateProps) {
  const canShowAction = Boolean(actionLabel && onAction);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center px-6 py-14 text-center"
      >
        {icon ? (
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary">
            {icon}
          </div>
        ) : null}

        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
          {description}
        </p>

        {canShowAction ? (
          <Button
            type="button"
            className="mt-6"
            disabled={actionDisabled}
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
