import { AlertTriangle } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

type ErrorStateProps = {
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
};

export function ErrorState({
    title = "Algo saiu do esperado",
    description = "Tente novamente em instantes.",
    actionLabel,
    onAction
}: ErrorStateProps) {
    return (
        <Card>
            <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="font-medium">{title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                    </div>
                </div>

                {actionLabel && onAction ? (
                    <Button variant="outline" onClick={onAction}>
                        {actionLabel}
                    </Button>
                ) : null}
            </CardContent>
        </Card>
    );
}