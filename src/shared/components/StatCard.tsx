import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/shared/components/ui/card";

type StatCardProps = {
  title: string;
  value: ReactNode;
  description: string;
  icon: LucideIcon;
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon
}: StatCardProps) {
  return (
    <Card className="group h-full overflow-hidden border-border/70 bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="min-w-0">
          <CardDescription>{title}</CardDescription>
          <CardTitle className="mt-2 break-words text-3xl text-foreground">
            {value}
          </CardTitle>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
