import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/shared/components/ui/card";

type QuickActionCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  actionLabel: string;
};

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  to,
  actionLabel
}: QuickActionCardProps) {
  return (
    <Card className="group h-full overflow-hidden border-border/70 bg-card shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md">
      <CardHeader>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </div>

        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription className="leading-6">{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <Button asChild variant="outline" className="h-11 w-full rounded-2xl">
          <Link to={to} aria-label={`${actionLabel}: ${title}`}>
            {actionLabel}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
