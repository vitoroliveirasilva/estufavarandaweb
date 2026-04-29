import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui/card";
import { cn } from "@/shared/utils/cn";

type LoadingStateProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function LoadingState({
  title = "Carregando",
  description = "Buscando as informações necessárias.",
  className
}: LoadingStateProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden border-border/70 bg-card shadow-sm",
        className
      )}
    >
      <CardContent
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="flex items-center gap-4 p-5"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 text-primary">
          <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-foreground">{title}</p>
          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
