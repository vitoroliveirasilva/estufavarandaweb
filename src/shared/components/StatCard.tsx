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
    value: string | number;
    description: string;
    icon: LucideIcon;
};

export function StatCard({ title, value, description, icon: Icon }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                <div>
                    <CardDescription>{title}</CardDescription>
                    <CardTitle className="mt-2 text-3xl">{value}</CardTitle>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <Icon className="h-5 w-5" />
                </div>
            </CardHeader>

            <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}