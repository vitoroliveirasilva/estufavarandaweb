import {
    ArrowLeft,
    RefreshCw,
    Sparkles
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { AiConversationsList } from "@/features/ai/components/AiConversationsList";
import { AiQuestionForm } from "@/features/ai/components/AiQuestionForm";
import {
    normalizeAskAiFormValues,
    useAiConversations,
    useAskPlantAiMutation
} from "@/features/ai/hooks/usePlantAi";
import type { AskAiFormValues } from "@/features/ai/schemas/aiSchemas";
import type {
    AiAnswerPayload,
    AiConversation,
    AskAiResponse,
    JsonObject
} from "@/features/ai/types/aiTypes";
import { usePlantDetail } from "@/features/plants/hooks/usePlants";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function parsePositiveInt(
    value: string | null | undefined,
    fallback: number,
    max?: number
): number {
    if (!value) {
        return fallback;
    }

    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
        return fallback;
    }

    return typeof max === "number" ? Math.min(parsed, max) : parsed;
}

function normalizeTotalPages(value: unknown, total: number, pageSize: number): number {
    const parsed = Number(value);

    if (Number.isInteger(parsed) && parsed > 0) {
        return parsed;
    }

    return Math.max(1, Math.ceil(total / pageSize));
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

function getResponseText(response: AskAiResponse): string {
    return (
        extractTextFromValue(response.answer) ??
        extractTextFromValue(response.resposta) ??
        extractTextFromValue(response.message) ??
        extractTextFromValue(response.recommendation) ??
        extractTextFromValue(response.summary) ??
        extractTextFromValue(response.diagnosis) ??
        "A IA respondeu, mas não foi possível interpretar o texto retornado."
    );
}

function getConversationId(response: AskAiResponse): number | null {
    const value = response.conversation_id;
    const parsed = Number(value);

    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function getAnswerPayload(response: AskAiResponse): AiAnswerPayload {
    return {
        answer: getResponseText(response),
        confidence:
            typeof response.confidence === "string" ? response.confidence : "low",
        considered_context: isRecord(response.considered_context)
            ? (response.considered_context as JsonObject)
            : {}
    };
}

function buildPreviewConversation({
    id,
    question,
    askedAt,
    response
}: {
    id: number;
    question: string;
    askedAt: string;
    response?: AskAiResponse | null;
}): AiConversation {
    const answerPayload = response ? getAnswerPayload(response) : null;
    const answeredAt = response ? new Date().toISOString() : askedAt;

    return {
        id,
        title: question,
        question,
        answer: answerPayload,
        response: response ?? null,
        created_at: askedAt,
        updated_at: answeredAt,
        messages: [
            {
                role: "user",
                content: question,
                created_at: askedAt,
                metadata_json: null
            },
            ...(answerPayload
                ? [
                    {
                        role: "assistant",
                        content: answerPayload.answer,
                        created_at: answeredAt,
                        metadata_json: {
                            confidence: answerPayload.confidence ?? "low",
                            considered_context:
                                answerPayload.considered_context ?? {}
                        }
                    }
                ]
                : [])
        ]
    };
}

export function PlantAiPage() {
    const { plantId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [previewConversation, setPreviewConversation] =
        useState<AiConversation | null>(null);

    const parsedPlantId = parsePositiveInt(plantId, 0);
    const page = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
    const pageSize = parsePositiveInt(
        searchParams.get("page_size"),
        DEFAULT_PAGE_SIZE,
        MAX_PAGE_SIZE
    );

    const conversationsParams = useMemo(
        () => ({ page, page_size: pageSize }),
        [page, pageSize]
    );

    const plantQuery = usePlantDetail(parsedPlantId, parsedPlantId > 0);
    const conversationsQuery = useAiConversations(
        parsedPlantId,
        conversationsParams,
        parsedPlantId > 0
    );
    const askMutation = useAskPlantAiMutation(parsedPlantId);

    if (!parsedPlantId) {
        return (
            <ErrorState
                title="Planta inválida"
                description="O identificador informado na URL não é válido."
            />
        );
    }

    const conversations = conversationsQuery.data?.items ?? [];
    const total = conversationsQuery.data?.meta?.total ?? conversations.length;
    const totalPages = normalizeTotalPages(
        conversationsQuery.data?.meta?.total_pages,
        total,
        pageSize
    );

    const serverAlreadyHasPreview =
        previewConversation?.id &&
        previewConversation.id > 0 &&
        conversations.some((conversation) => conversation.id === previewConversation.id);

    const visibleConversations =
        previewConversation && !serverAlreadyHasPreview
            ? [previewConversation, ...conversations]
            : conversations;

    const displayTotal =
        previewConversation && !serverAlreadyHasPreview ? total + 1 : total;

    const displayTotalPages = Math.max(
        1,
        normalizeTotalPages(totalPages, displayTotal, pageSize)
    );

    const hasConversations = visibleConversations.length > 0;
    const isInitialLoading = conversationsQuery.isPending && !previewConversation;
    const plantName = plantQuery.data?.name;

    function goToPage(nextPage: number) {
        const boundedPage = Math.min(Math.max(nextPage, 1), displayTotalPages);
        const next = new URLSearchParams(searchParams);

        next.set("page", String(boundedPage));
        next.set("page_size", String(pageSize));
        setSearchParams(next);
    }

    function forceFirstPage() {
        if (page === 1) {
            return;
        }

        const next = new URLSearchParams(searchParams);

        next.set("page", "1");
        next.set("page_size", String(pageSize));
        setSearchParams(next);
    }

    async function handleAsk(values: AskAiFormValues) {
        const question = values.question.trim();
        const askedAt = new Date().toISOString();
        const temporaryId = -Date.now();

        forceFirstPage();

        setPreviewConversation(
            buildPreviewConversation({
                id: temporaryId,
                question,
                askedAt,
                response: null
            })
        );

        try {
            const response = await askMutation.mutateAsync(
                normalizeAskAiFormValues(values)
            );

            setPreviewConversation(
                buildPreviewConversation({
                    id: getConversationId(response) ?? temporaryId,
                    question,
                    askedAt,
                    response
                })
            );
        } catch (error) {
            setPreviewConversation(null);
            throw error;
        }
    }

    return (
        <>
            <PageHeader
                eyebrow="ASSISTENTE VIRTUAL"
                title={plantName ? `${plantName}` : "Chat com IA"}
                actions={
                    <Button asChild variant="outline">
                        <Link to={`/app/plants/${parsedPlantId}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar para planta
                        </Link>
                    </Button>
                }
            />

            {plantQuery.isError ? (
                <div className="mb-5">
                    <ErrorState
                        title="Não foi possível carregar os dados da planta"
                        description={getAppErrorMessage(plantQuery.error)}
                        actionLabel="Tentar novamente"
                        onAction={() => void plantQuery.refetch()}
                    />
                </div>
            ) : null}

            <div className="space-y-5">
                <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
                    <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-muted/20 px-4 py-3">
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground">
                                Chat da planta
                            </p>
                        </div>

                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-10 w-10 rounded-2xl"
                            disabled={conversationsQuery.isFetching}
                            aria-label="Atualizar conversas"
                            onClick={() => void conversationsQuery.refetch()}
                        >
                            <RefreshCw
                                className={
                                    conversationsQuery.isFetching
                                        ? "h-4 w-4 animate-spin"
                                        : "h-4 w-4"
                                }
                            />
                        </Button>
                    </div>

                    <CardContent className="max-h-[46rem] space-y-4 overflow-y-auto bg-muted/10 p-4">
                        {isInitialLoading ? (
                            <LoadingState
                                title="Carregando conversas"
                                description="Buscando histórico de IA da planta."
                            />
                        ) : null}

                        {conversationsQuery.isError ? (
                            <ErrorState
                                title="Não foi possível carregar as conversas"
                                description={getAppErrorMessage(conversationsQuery.error)}
                                actionLabel="Tentar novamente"
                                onAction={() => void conversationsQuery.refetch()}
                            />
                        ) : null}

                        {!isInitialLoading && !conversationsQuery.isError ? (
                            <AiConversationsList
                                conversations={visibleConversations}
                                thinkingConversationId={
                                    askMutation.isPending
                                        ? previewConversation?.id ?? null
                                        : null
                                }
                            />
                        ) : null}
                    </CardContent>

                    <AiQuestionForm
                        isSubmitting={askMutation.isPending}
                        apiErrorMessage={
                            askMutation.error
                                ? getAppErrorMessage(askMutation.error)
                                : null
                        }
                        onSubmit={handleAsk}
                    />
                </Card>

                {hasConversations && displayTotalPages > 1 ? (
                    <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-sm sm:flex-row">
                        <p className="text-sm text-muted-foreground" aria-live="polite">
                            Página {page} de {displayTotalPages} · {displayTotal} conversa(s)
                            {conversationsQuery.isFetching && !isInitialLoading
                                ? " · Atualizando"
                                : ""}
                        </p>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="rounded-2xl"
                                disabled={page <= 1 || conversationsQuery.isFetching}
                                onClick={() => goToPage(page - 1)}
                            >
                                Anterior
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="rounded-2xl"
                                disabled={
                                    page >= displayTotalPages ||
                                    conversationsQuery.isFetching
                                }
                                onClick={() => goToPage(page + 1)}
                            >
                                Próxima
                            </Button>
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    );
}
