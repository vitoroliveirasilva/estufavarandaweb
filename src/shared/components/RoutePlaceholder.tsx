import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/shared/components/ui/card";

type RoutePlaceholderProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  bullets?: readonly string[];
  action?: {
    label: string;
    to: string;
  };
};

export function RoutePlaceholder({
  icon,
  title,
  description,
  bullets = [],
  action
}: RoutePlaceholderProps) {
  return (
    <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            {icon ? (
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 text-primary shadow-sm">
                {icon}
              </div>
            ) : null}

            <div className="min-w-0">
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="mt-1 max-w-2xl leading-6">
                {description}
              </CardDescription>
            </div>
          </div>

          {action ? (
            <Button asChild className="h-11 shrink-0 rounded-2xl">
              <Link to={action.to}>{action.label}</Link>
            </Button>
          ) : null}
        </div>
      </CardHeader>

      {bullets.length > 0 ? (
        <CardContent>
          <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
            {bullets.map((bullet, index) => (
              <li
                key={`${bullet}-${index}`}
                className="rounded-2xl border border-border/70 bg-background px-4 py-3 leading-6 shadow-sm"
              >
                {bullet}
              </li>
            ))}
          </ul>
        </CardContent>
      ) : null}
    </Card>
  );
}
