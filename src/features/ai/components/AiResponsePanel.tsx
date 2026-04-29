import type { ReactNode } from "react";
import {
    Bot,
    CheckCircle2,
    Clock3,
    FileText,
    Loader2,
    LockKeyhole,
    MessageSquareText,
    Sparkles,
    UserRound
} from "lucide-react";

import type { AskAiResponse, JsonValue } from "@/features/ai/types/aiTypes";

const MAX_RENDERED_TEXT_LENGTH = 12_000;

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
    diagnostico: "Diagnóstico"
};

const CONTEXT_LABELS: Record<string, string> = {
    last_watering_days: "Última rega",
    recent_heat: "Calor recente",
    recent_repotting: "Replantio recente",
    recent_wilt: "Murcha recente",
    recent_yellow_leaves: "Folhas amarelas recentes",
    recent_pest: "Praga recente",
    risk_level: "Risco",
    watering_score: "Pontuação de rega"
};

const RISK_LABELS: Record<string, string> = {
    low: "Baixo",
    normal: "Normal",
    attention: "Atenção",
    warning: "Atenção",
    high: "Alto",
    critical: "Crítico"
};

const CONFIDENCE_LABELS: Record<string, string> = {
    low: "Baixa",
    medium: "Média",
    high: "Alta"
};

const HIDDEN_KEYS = new Set([
    "id",
    "conversation_id",
    "conversationid",
    "created_at",
    "updated_at"
]);

const CONTEXT_KEYS = new Set([
    "considered_context",
    "consideredcontext",
    "context",
    "metadata",
    "debug"
]);

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

type AiResponsePanelProps = {
    question?: string | null;
    askedAt?: string | null;
    response?: AskAiResponse | null;
    isLoading?: boolean;
};

function normalizeKey(key: string): string {
    return key.trim().toLowerCase().replace(/[_-]/g, "");
}

function formatDateTime(value?: string | null): string {
    const date = value ? new Date(value) : new Date();

    if (Number.isNaN(date.getTime())) {
        return new Intl.DateTimeFormat("pt-BR", {
            dateStyle: "short",
            timeStyle: "short"
        }).format(new Date());
    }

    return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    }).format(date);
}

function formatKey(key: string): string {
    const normalizedKey = key.trim();
    const label = KEY_LABELS[normalizedKey.toLowerCase()];

    if (label) {
        return label;
    }

    return normalizedKey
        .replaceAll("_", " ")
        .replaceAll("-", " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function truncateText(value: string): string {
    if (value.length <= MAX_RENDERED_TEXT_LENGTH) {
        return value;
    }

    return `${value.slice(0, MAX_RENDERED_TEXT_LENGTH)}\n\n…conteúdo reduzido para exibição.`;
}

function formatPrimitive(value: JsonValue): string {
    if (value === null || value === "") {
        return "Não informado";
    }

    if (typeof value === "boolean") {
        return value ? "Sim" : "Não";
    }

    if (typeof value === "number") {
        return new Intl.NumberFormat("pt-BR", {
            maximumFractionDigits: 2
        }).format(value);
    }

    return truncateText(String(value));
}

function formatContextValue(key: string, value: JsonValue): string {
    if (key === "last_watering_days" && typeof value === "number") {
        if (value <= 0) {
            return "Hoje";
        }

        return value === 1 ? "1 dia" : `${value} dias`;
    }

    if (key === "risk_level" && typeof value === "string") {
        return RISK_LABELS[value.toLowerCase()] ?? value;
    }

    return formatPrimitive(value);
}

function formatConfidence(value: JsonValue | undefined): string | null {
    if (typeof value === "string") {
        return CONFIDENCE_LABELS[value.toLowerCase()] ?? value;
    }

    if (typeof value === "number") {
        return `${value}%`;
    }

    return null;
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

function renderText(value: string): ReactNode {
    const paragraphs = truncateText(value)
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

    if (!paragraphs.length) {
        return <p>Não informado</p>;
    }

    return (
        <div className="space-y-3">
            {paragraphs.map((paragraph, index) => (
                <p key={`${paragraph.slice(0, 24)}-${index}`}>
                    {paragraph}
                </p>
            ))}
        </div>
    );
}

function renderJsonValue(value: JsonValue): ReactNode {
    if (
        value === null ||
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
    ) {
        return typeof value === "string" ? renderText(value) : formatPrimitive(value);
    }

    if (Array.isArray(value)) {
        if (!value.length) {
            return "Nenhum item informado.";
        }

        return (
            <ul className="space-y-2">
                {value.map((item, index) => (
                    <li
                        key={index}
                        className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
                    >
                        <div className="flex gap-2">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <div className="min-w-0 text-sm leading-6 text-muted-foreground">
                                {renderJsonValue(item)}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

    const entries = Object.entries(value);

    if (!entries.length) {
        return "Informação registrada.";
    }

    return (
        <div className="grid gap-3">
            {entries.map(([key, item]) => (
                <div
                    key={key}
                    className="rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
                >
                    <p className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                        <FileText className="h-4 w-4 text-primary" />
                        {formatKey(key)}
                    </p>

                    <div className="text-sm leading-6 text-muted-foreground">
                        {renderJsonValue(item)}
                    </div>
                </div>
            ))}
        </div>
    );
}

function getVisibleEntries(response?: AskAiResponse | null): Entry[] {
    return orderEntries(
        Object.entries(response ?? {}).filter(([key]) => {
            const normalized = normalizeKey(key);

            return !HIDDEN_KEYS.has(normalized) && !CONTEXT_KEYS.has(normalized);
        }) as Entry[]
    ).filter(([key]) => key.toLowerCase() !== "confidence");
}

function getContextEntries(response?: AskAiResponse | null): Entry[] {
    const contextEntry = Object.entries(response ?? {}).find(([key]) =>
        CONTEXT_KEYS.has(normalizeKey(key))
    );

    const contextValue = contextEntry?.[1];

    if (
        !contextValue ||
        typeof contextValue !== "object" ||
        Array.isArray(contextValue)
    ) {
        return [];
    }

    return Object.entries(contextValue) as Entry[];
}

function getConfidence(response?: AskAiResponse | null): string | null {
    const value = response?.confidence ?? response?.confianca;
    return formatConfidence(value);
}

function UserBubble({
    question,
    askedAt
}: {
    question: string;
    askedAt?: string | null;
}) {
    return (
        <div className="flex justify-end">
            <div className="max-w-[92%] rounded-3xl rounded-tr-md border border-primary/20 bg-primary px-4 py-3 text-primary-foreground shadow-sm sm:max-w-[78%]">
                <div className="mb-2 flex flex-wrap items-center justify-end gap-2">
                    <span className="inline-flex items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-2.5 py-0.5 text-xs font-medium">
                        <UserRound className="mr-1.5 h-3.5 w-3.5" />
                        Você
                    </span>

                    <span className="inline-flex items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-2.5 py-0.5 text-xs font-medium">
                        <LockKeyhole className="mr-1.5 h-3.5 w-3.5" />
                        Privada
                    </span>
                </div>

                <p className="whitespace-pre-wrap break-words text-sm leading-6">
                    {question}
                </p>

                <div className="mt-3 flex justify-end border-t border-primary-foreground/20 pt-2 text-xs opacity-85">
                    <span className="inline-flex items-center">
                        <Clock3 className="mr-1.5 h-3.5 w-3.5" />
                        {formatDateTime(askedAt)}
                    </span>
                </div>
            </div>
        </div>
    );
}

function AssistantEmptyBubble() {
    return (
        <div className="flex justify-start">
            <div className="max-w-[90%] rounded-3xl rounded-tl-md border border-border/70 bg-background px-4 py-3 shadow-sm sm:max-w-[78%]">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary">
                        <Bot className="mr-1.5 h-3.5 w-3.5" />
                        IA
                    </span>

                    <span className="inline-flex items-center rounded-full border border-border/70 bg-muted/30 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        <LockKeyhole className="mr-1.5 h-3.5 w-3.5" />
                        Privada
                    </span>
                </div>

                <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-muted/60 text-primary">
                        <MessageSquareText className="h-4 w-4" />
                    </div>

                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">
                            Faça sua primeira pergunta
                        </p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            A resposta da IA aparecerá aqui como uma mensagem do chat.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AiResponsePanel({
    question,
    askedAt,
    response,
    isLoading = false
}: AiResponsePanelProps) {
    const entries = getVisibleEntries(response);
    const contextEntries = getContextEntries(response);
    const confidence = getConfidence(response);
    const hasQuestion = Boolean(question?.trim());

    if (!hasQuestion && !isLoading && entries.length === 0) {
        return <AssistantEmptyBubble />;
    }

    return (
        <div className="space-y-4">
            {hasQuestion ? (
                <UserBubble question={question!.trim()} askedAt={askedAt} />
            ) : null}

            {isLoading ? (
                <div className="flex justify-start">
                    <div className="max-w-[90%] rounded-3xl rounded-tl-md border border-primary/20 bg-primary/5 px-4 py-3 shadow-sm sm:max-w-[78%]">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-background text-primary shadow-sm">
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-foreground">
                                    A IA está analisando...
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Lendo o contexto da planta para responder melhor.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

            {!isLoading && entries.length ? (
                <div className="flex justify-start">
                    <div className="max-w-[94%] rounded-3xl rounded-tl-md border border-primary/20 bg-primary/5 px-4 py-4 shadow-sm sm:max-w-[84%]">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center rounded-full border border-primary/20 bg-background px-2.5 py-0.5 text-xs font-medium text-primary">
                                <Bot className="mr-1.5 h-3.5 w-3.5" />
                                IA
                            </span>

                            <span className="inline-flex items-center rounded-full border border-border/70 bg-background/80 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                <Clock3 className="mr-1.5 h-3.5 w-3.5" />
                                {formatDateTime(askedAt)}
                            </span>

                            <span className="inline-flex items-center rounded-full border border-border/70 bg-background/80 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                <LockKeyhole className="mr-1.5 h-3.5 w-3.5" />
                                Privada
                            </span>

                            {confidence ? (
                                <span className="inline-flex items-center rounded-full border border-primary/20 bg-background px-2.5 py-0.5 text-xs font-medium text-primary">
                                    Confiança: {confidence}
                                </span>
                            ) : null}
                        </div>

                        <div className="space-y-3">
                            {entries.map(([key, value], index) => {
                                const isMain = index === 0;
                                const Icon = isMain ? Sparkles : FileText;

                                return (
                                    <section
                                        key={key}
                                        className={
                                            isMain
                                                ? "rounded-2xl border border-primary/20 bg-background px-4 py-3"
                                                : "rounded-2xl border border-border/70 bg-background/80 px-4 py-3"
                                        }
                                    >
                                        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                                            <Icon className="h-4 w-4 text-primary" />
                                            {formatKey(key)}
                                        </div>

                                        <div className="whitespace-pre-wrap break-words text-sm leading-7 text-muted-foreground">
                                            {renderJsonValue(value)}
                                        </div>
                                    </section>
                                );
                            })}
                        </div>

                        {contextEntries.length ? (
                            <div className="mt-3 rounded-2xl border border-border/70 bg-background/70 px-4 py-3">
                                <p className="mb-3 text-sm font-semibold text-foreground">
                                    Contexto usado
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {contextEntries.map(([key, value]) => (
                                        <span
                                            key={key}
                                            className="inline-flex items-center rounded-full border border-border/70 bg-muted/30 px-2.5 py-1 text-xs font-medium text-muted-foreground"
                                        >
                                            {CONTEXT_LABELS[key] ?? formatKey(key)}:{" "}
                                            {formatContextValue(key, value)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
