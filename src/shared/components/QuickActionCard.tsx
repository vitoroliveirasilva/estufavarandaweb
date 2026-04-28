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
    <Card className="h-full overflow-hidden">
      <CardHeader>
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-primary">
          <Icon aria-hidden="true" className="h-5 w-5" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="leading-6">{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <Button asChild variant="outline" className="w-full">
          <Link to={to} aria-label={`${actionLabel}: ${title}`}>
            {actionLabel}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
