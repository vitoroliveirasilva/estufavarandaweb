import { type ReactNode } from "react";
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
    bullets?: string[];
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
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-4">
                        {icon ? (
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                                {icon}
                            </div>
                        ) : null}
                        <div>
                            <CardTitle>{title}</CardTitle>
                            <CardDescription className="mt-2 max-w-2xl leading-6">
                                {description}
                            </CardDescription>
                        </div>
                    </div>

                    {action ? (
                        <Button asChild>
                            <Link to={action.to}>{action.label}</Link>
                        </Button>
                    ) : null}
                </div>
            </CardHeader>

            {bullets.length > 0 ? (
                <CardContent>
                    <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                        {bullets.map((bullet) => (
                            <li
                                key={bullet}
                                className="rounded-xl border bg-background px-4 py-3"
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