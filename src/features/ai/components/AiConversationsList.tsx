import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    Bot,
    CalendarClock,
    History,
    Leaf,
    Loader2,
    LockKeyhole,
    MessageSquareText,
    Sparkles,
    UserRound
} from "lucide-react";

import type {
    AiConversation,
    AiConversationMessage,
    JsonObject
} from "@/features/ai/types/aiTypes";

type AiConversationsListProps = {
    conversations: AiConversation[];
    thinkingConversationId?: number | null;
};

const EMPTY_SUGGESTIONS = [
    "Minha planta está com folhas amareladas. O que pode ser?",
    "Com base no histórico, preciso regar agora?",
    "Quais sinais devo observar nos próximos dias?"
] as const;

function formatDateTime(value?: string): string {
    if (!value) {
        return "Horário não informado";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return format(date, "dd/MM/yyyy 'às' HH:mm", {
        locale: ptBR
    });
}

function normalizeRole(role: string): string {
    return role.trim().toLowerCase();
}

function getSafeTimestamp(value?: string): number {
    if (!value) {
        return 0;
    }

    const parsed = new Date(value).getTime();
    return Number.isNaN(parsed) ? 0 : parsed;
}

function getOrderedMessages(conversation: AiConversation): AiConversationMessage[] {
    return [...(conversation.messages ?? [])].sort((a, b) => {
        const dateA = getSafeTimestamp(a.created_at);
        const dateB = getSafeTimestamp(b.created_at);

        if (dateA !== dateB) {
            return dateA - dateB;
        }

        return (a.id ?? 0) - (b.id ?? 0);
    });
}

function getOrderedConversations(conversations: AiConversation[]): AiConversation[] {
    return [...conversations].sort((a, b) => {
        const dateA = getSafeTimestamp(a.created_at || a.updated_at);
        const dateB = getSafeTimestamp(b.created_at || b.updated_at);

        if (dateA !== dateB) {
            return dateA - dateB;
        }

        return a.id - b.id;
    });
}

function getConversationQuestion(conversation: AiConversation): string {
    const question = conversation.question?.trim();

    if (question) {
        return question;
    }

    const userMessage = getOrderedMessages(conversation).find(
        (message) => normalizeRole(message.role) === "user"
    );

    if (userMessage?.content.trim()) {
        return userMessage.content.trim();
    }

    const title = conversation.title?.trim();

    return title || "Conversa sem título";
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

function extractTextFromValue(value: unknown): string | null {
    if (value === undefined || value === null || value === "") {
        return null;
    }

    if (typeof value === "string") {
        return value.trim() || null;
    }

    if (typeof value === "number" || typeof value === "boolean") {
        return String(value);
    }

    if (Array.isArray(value)) {
        const parts = value
            .map(extractTextFromValue)
            .filter((item): item is string => Boolean(item));

        return parts.length ? parts.join("\n") : null;
    }

    if (isRecord(value)) {
        const preferredKeys = [
            "answer",
            "resposta",
            "message",
            "mensagem",
            "recommendation",
            "recomendacao",
            "summary",
            "resumo",
            "diagnosis",
            "diagnostico"
        ];

        for (const key of preferredKeys) {
            const text = extractTextFromValue(value[key]);

            if (text) {
                return text;
            }
        }
    }

    return null;
}

function getAssistantAnswer(conversation: AiConversation): string | null {
    const assistantMessage = [...getOrderedMessages(conversation)]
        .reverse()
        .find((message) => normalizeRole(message.role) === "assistant");

    if (assistantMessage?.content.trim()) {
        return assistantMessage.content.trim();
    }

    return (
        extractTextFromValue(conversation.response) ??
        extractTextFromValue(conversation.answer)
    );
}

function getMessageCreatedAt(
    conversation: AiConversation,
    role: "user" | "assistant"
): string {
    const message =
        role === "assistant"
            ? [...getOrderedMessages(conversation)]
                  .reverse()
                  .find((item) => normalizeRole(item.role) === role)
            : getOrderedMessages(conversation).find(
                  (item) => normalizeRole(item.role) === role
              );

    return message?.created_at || conversation.created_at;
}

function formatConfidence(metadata?: JsonObject | null): string | null {
    const value = metadata?.confidence;

    if (typeof value !== "string") {
        return null;
    }

    const labels: Record<string, string> = {
        low: "Baixa",
        medium: "Média",
        high: "Alta"
    };

    return labels[value.toLowerCase()] ?? value;
}

function EmptyChatState() {
    return (
        <div className="rounded-[28px] border border-dashed border-border/70 bg-gradient-to-b from-muted/30 via-background to-background p-6 shadow-sm">
            <div className="mx-auto flex max-w-xl flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl border border-primary/15 bg-primary/8 text-primary shadow-sm">
                    <MessageSquareText className="h-7 w-7" />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-foreground">
                    Nenhuma conversa iniciada ainda
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                    Faça a primeira pergunta para começar o chat da planta. Você
                    pode falar sobre sintomas, rega, pragas, mudanças de ambiente
                    ou cuidados dos próximos dias.
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                        <LockKeyhole className="mr-1.5 h-3.5 w-3.5 text-primary" />
                        Conversa privada
                    </span>

                    <span className="inline-flex items-center rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                        <Leaf className="mr-1.5 h-3.5 w-3.5 text-primary" />
                        Histórico por planta
                    </span>

                    <span className="inline-flex items-center rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                        <Sparkles className="mr-1.5 h-3.5 w-3.5 text-primary" />
                        Resposta orientativa
                    </span>
                </div>

                <div className="mt-6 w-full rounded-3xl border border-border/70 bg-muted/20 p-4 text-left">
                    <div className="mb-3 flex items-center gap-2">
                        <History className="h-4 w-4 text-primary" />
                        <p className="text-sm font-medium text-foreground">
                            Exemplos do que você pode perguntar
                        </p>
                    </div>

                    <div className="space-y-2">
                        {EMPTY_SUGGESTIONS.map((suggestion) => (
                            <div
                                key={suggestion}
                                className="rounded-2xl border border-border/70 bg-background px-4 py-3 text-sm leading-6 text-muted-foreground shadow-sm"
                            >
                                {suggestion}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function UserBubble({
    text,
    createdAt
}: {
    text: string;
    createdAt: string;
}) {
    return (
        <div className="flex justify-end">
            <div className="max-w-[92%] rounded-3xl rounded-br-md border border-primary/20 bg-primary px-4 py-3 text-primary-foreground shadow-sm sm:max-w-[78%]">
                <div className="mb-2 flex flex-wrap items-center justify-end gap-2">
                    <span className="inline-flex items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-2.5 py-0.5 text-xs font-medium">
                        <UserRound className="mr-1.5 h-3.5 w-3.5" />
                        Você
                    </span>
                </div>

                <p className="whitespace-pre-wrap break-words text-sm leading-6">
                    {text}
                </p>

                <div className="mt-3 flex justify-end border-t border-primary-foreground/20 pt-2 text-xs opacity-85">
                    <span className="inline-flex items-center">
                        <CalendarClock className="mr-1.5 h-3.5 w-3.5" />
                        {formatDateTime(createdAt)}
                    </span>
                </div>
            </div>
        </div>
    );
}

function AssistantBubble({
    text,
    createdAt,
    metadata
}: {
    text: string;
    createdAt: string;
    metadata?: JsonObject | null;
}) {
    const confidence = formatConfidence(metadata);

    return (
        <div className="flex justify-start">
            <div className="max-w-[92%] rounded-3xl rounded-bl-md border border-border/70 bg-background px-4 py-3 shadow-sm sm:max-w-[78%]">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary">
                        <Bot className="mr-1.5 h-3.5 w-3.5" />
                        IA
                    </span>

                    <span className="inline-flex items-center rounded-full border border-border/70 bg-muted/30 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        <LockKeyhole className="mr-1.5 h-3.5 w-3.5" />
                        Privada
                    </span>

                    {confidence ? (
                        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs font-medium text-primary">
                            Confiança: {confidence}
                        </span>
                    ) : null}
                </div>

                <p className="whitespace-pre-wrap break-words text-sm leading-6 text-foreground">
                    {text}
                </p>

                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-border/60 pt-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center">
                        <CalendarClock className="mr-1.5 h-3.5 w-3.5 text-primary" />
                        {formatDateTime(createdAt)}
                    </span>
                </div>
            </div>
        </div>
    );
}

function ThinkingBubble() {
    return (
        <div className="flex justify-start">
            <div className="max-w-[92%] rounded-3xl rounded-bl-md border border-primary/20 bg-primary/5 px-4 py-3 shadow-sm sm:max-w-[78%]">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-background text-primary shadow-sm">
                        <Loader2 className="h-4 w-4 animate-spin" />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-foreground">
                            A IA está analisando...
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Lendo o histórico da planta para responder melhor.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function renderConversationMessages(
    conversation: AiConversation,
    thinkingConversationId?: number | null
) {
    const messages = getOrderedMessages(conversation);

    if (messages.length) {
        const hasAssistantMessage = messages.some(
            (message) => normalizeRole(message.role) === "assistant"
        );

        return (
            <>
                {messages.map((message, index) => {
                    const role = normalizeRole(message.role);

                    if (role === "user") {
                        return (
                            <UserBubble
                                key={`${conversation.id}-user-${message.id ?? index}`}
                                text={message.content}
                                createdAt={
                                    message.created_at || conversation.created_at
                                }
                            />
                        );
                    }

                    if (role === "assistant") {
                        return (
                            <AssistantBubble
                                key={`${conversation.id}-assistant-${message.id ?? index}`}
                                text={message.content}
                                createdAt={
                                    message.created_at || conversation.updated_at
                                }
                                metadata={message.metadata_json}
                            />
                        );
                    }

                    return null;
                })}

                {conversation.id === thinkingConversationId && !hasAssistantMessage ? (
                    <ThinkingBubble />
                ) : null}
            </>
        );
    }

    const question = getConversationQuestion(conversation);
    const answer = getAssistantAnswer(conversation);

    return (
        <>
            <UserBubble
                text={question}
                createdAt={getMessageCreatedAt(conversation, "user")}
            />

            {answer ? (
                <AssistantBubble
                    text={answer}
                    createdAt={getMessageCreatedAt(conversation, "assistant")}
                />
            ) : conversation.id === thinkingConversationId ? (
                <ThinkingBubble />
            ) : null}
        </>
    );
}

export function AiConversationsList({
    conversations,
    thinkingConversationId = null
}: AiConversationsListProps) {
    if (conversations.length === 0) {
        return <EmptyChatState />;
    }

    const orderedConversations = getOrderedConversations(conversations);

    return (
        <div
            className="flex min-h-full flex-col justify-end space-y-5"
            aria-label="Histórico de conversas da planta"
        >
            <div className="flex justify-center">
                <span className="inline-flex items-center rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                    <History className="mr-1.5 h-3.5 w-3.5 text-primary" />
                    Conversas salvas
                </span>
            </div>

            {orderedConversations.map((conversation) => (
                <div key={conversation.id} className="space-y-3">
                    {renderConversationMessages(
                        conversation,
                        thinkingConversationId
                    )}
                </div>
            ))}
        </div>
    );
}
