import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/shared/components/ui/card";

type LoadingStateProps = {
    title?: string;
    description?: string;
};

export function LoadingState({
    title = "Carregando",
    description = "Buscando as informações necessárias."
}: LoadingStateProps) {
    return (
        <Card>
            <CardContent className="flex items-center gap-4 p-6">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <div>
                    <p className="font-medium">{title}</p>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </CardContent>
        </Card>
    );
}