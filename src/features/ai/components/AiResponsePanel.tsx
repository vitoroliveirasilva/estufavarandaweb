import { Bot } from "lucide-react";

import type { AskAiResponse, JsonValue } from "@/features/ai/types/aiTypes";
import { EmptyState } from "@/shared/components/EmptyState";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

const MAX_RENDERED_VALUE_LENGTH = 12_000;

const KEY_LABELS: Record<string, string> = {
    answer: "Resposta",
    resposta: "Resposta",
    message: "Mensagem",
    mensagem: "Mensagem",
    recommendation: "Recomendação",
    recomendacao: "Recomendação",
    recommendations: "Recomendações",
    recomendacoes: "Recomendações",
    summary: "Resumo",
    resumo: "Resumo",
    diagnosis: "Diagnóstico",
    diagnostico: "Diagnóstico",
    confidence: "Confiança",
    conversation_id: "Conversa"
};

const PRIORITY_KEYS = [
    "answer",
    "resposta",
    "message",
    "mensagem",
    "recommendation",
    "recomendacao",
    "recommendations",
    "recomendacoes",
    "summary",
    "resumo",
    "diagnosis",
    "diagnostico"
];

type Entry = [string, JsonValue];

function formatKey(key: string): string {
    const normalizedKey = key.trim();
    const label = KEY_LABELS[normalizedKey.toLowerCase()];

    if (label) {
        return label;
    }

    return normalizedKey
        .replaceAll("_", " ")
        .replaceAll("-", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function stringifyJson(value: JsonValue): string {
    try {
        return JSON.stringify(value, null, 2);
    } catch {
        return String(value);
    }
}

function truncate(value: string): string {
    if (value.length <= MAX_RENDERED_VALUE_LENGTH) {
        return value;
    }

    return `${value.slice(0, MAX_RENDERED_VALUE_LENGTH)}\n\n…conteúdo reduzido para exibição.`;
}

function formatValue(value: JsonValue): string {
    if (value === null || value === "") {
        return "Não informado";
    }

    if (typeof value === "string") {
        return truncate(value);
    }

    if (typeof value === "number" || typeof value === "boolean") {
        return String(value);
    }

    return truncate(stringifyJson(value));
}

function orderEntries(entries: Entry[]): Entry[] {
    return [...entries].sort(([keyA], [keyB]) => {
        const priorityA = PRIORITY_KEYS.indexOf(keyA.toLowerCase());
        const priorityB = PRIORITY_KEYS.indexOf(keyB.toLowerCase());

        if (priorityA === -1 && priorityB === -1) {
            return keyA.localeCompare(keyB, "pt-BR");
        }

        if (priorityA === -1) {
            return 1;
        }

        if (priorityB === -1) {
            return -1;
        }

        return priorityA - priorityB;
    });
}

export function AiResponsePanel({ response }: { response?: AskAiResponse | null }) {
    const entries = orderEntries(Object.entries(response ?? {}) as Entry[]);

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
                    Orientação retornada pela API para a pergunta enviada.
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