import { Bot } from "lucide-react";

import type { AskAiResponse } from "@/features/ai/types/aiTypes";
import { EmptyState } from "@/shared/components/EmptyState";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

type AiResponsePanelProps = {
    response?: AskAiResponse | null;
};

function formatKey(key: string): string {
    return key
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatValue(value: unknown): string {
    if (value === null || value === undefined || value === "") {
        return "Não informado";
    }

    if (typeof value === "string") {
        return value;
    }

    if (typeof value === "number" || typeof value === "boolean") {
        return String(value);
    }

    return JSON.stringify(value, null, 2);
}

export function AiResponsePanel({ response }: AiResponsePanelProps) {
    const entries = Object.entries(response ?? {});

    if (entries.length === 0) {
        return (
            <EmptyState
                icon={<Bot className="h-6 w-6" />}
                title="Resposta da IA aparecerá aqui"
                description="Envie uma pergunta para receber a orientação retornada pela API."
            />
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Resposta da IA</CardTitle>
                <CardDescription>
                    Renderização tolerante, pois o serviço pode retornar campos variáveis.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
                {entries.map(([key, value]) => (
                    <div key={key} className="rounded-2xl border bg-background p-4">
                        <p className="text-sm font-medium">{formatKey(key)}</p>
                        <pre className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                            {formatValue(value)}
                        </pre>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}