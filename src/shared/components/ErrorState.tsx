import { AlertTriangle } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";

type ErrorStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionDisabled?: boolean;
  className?: string;
};

export function ErrorState({
  title = "Algo saiu do esperado",
  description = "Tente novamente em instantes.",
  actionLabel,
  onAction,
  actionDisabled = false,
  className
}: ErrorStateProps) {
  const canShowAction = Boolean(actionLabel && onAction);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent
        role="alert"
        className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex min-w-0 gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle aria-hidden="true" className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <p className="font-medium">{title}</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          </div>
        </div>

        {canShowAction ? (
          <Button
            type="button"
            variant="outline"
            disabled={actionDisabled}
            className="shrink-0"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
