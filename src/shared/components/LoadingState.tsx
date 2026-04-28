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
    <Card className={cn("overflow-hidden", className)}>
      <CardContent
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="flex items-center gap-4 p-6"
      >
        <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin text-primary" />
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
