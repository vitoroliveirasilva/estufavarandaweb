import { ArrowLeft, Bot } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { AiConversationsList } from "@/features/ai/components/AiConversationsList";
import { AiQuestionForm } from "@/features/ai/components/AiQuestionForm";
import { AiResponsePanel } from "@/features/ai/components/AiResponsePanel";
import {
    normalizeAskAiFormValues,
    useAiConversations,
    useAskPlantAiMutation
} from "@/features/ai/hooks/usePlantAi";
import type { AskAiFormValues } from "@/features/ai/schemas/aiSchemas";
import type { AskAiResponse } from "@/features/ai/types/aiTypes";
import { usePlantDetail } from "@/features/plants/hooks/usePlants";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";

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

export function PlantAiPage() {
    const { plantId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();
    const [lastResponse, setLastResponse] = useState<AskAiResponse | null>(null);

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
    const hasConversations = conversations.length > 0;
    const isInitialLoading = conversationsQuery.isPending;
    const plantName = plantQuery.data?.name;

    function goToPage(nextPage: number) {
        const boundedPage = Math.min(Math.max(nextPage, 1), totalPages);
        const next = new URLSearchParams(searchParams);

        next.set("page", String(boundedPage));
        next.set("page_size", String(pageSize));
        setSearchParams(next);
    }

    async function handleAsk(values: AskAiFormValues) {
        const response = await askMutation.mutateAsync(normalizeAskAiFormValues(values));
        setLastResponse(response);
    }

    return (
        <>
            <PageHeader
                eyebrow="IA"
                title={`IA${plantName ? ` · ${plantName}` : ""}`}
                description="Pergunte sobre a planta e acompanhe conversas registradas."
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

            <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-5">
                    <AiQuestionForm
                        isSubmitting={askMutation.isPending}
                        apiErrorMessage={
                            askMutation.error ? getAppErrorMessage(askMutation.error) : null
                        }
                        onSubmit={handleAsk}
                    />

                    <AiResponsePanel response={lastResponse} />
                </div>

                <div className="space-y-5">
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

                    {!isInitialLoading && !conversationsQuery.isError && !hasConversations ? (
                        <EmptyState
                            icon={<Bot className="h-6 w-6" />}
                            title="Nenhuma conversa registrada"
                            description="Quando a API registrar conversas de IA, elas aparecerão aqui."
                        />
                    ) : null}

                    {hasConversations ? (
                        <>
                            <AiConversationsList conversations={conversations} />

                            <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3 sm:flex-row">
                                <p className="text-sm text-muted-foreground" aria-live="polite">
                                    Página {page} de {totalPages} · {total} registro(s)
                                    {conversationsQuery.isFetching && !isInitialLoading
                                        ? " · Atualizando"
                                        : ""}
                                </p>

                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={page <= 1 || conversationsQuery.isFetching}
                                        onClick={() => goToPage(page - 1)}
                                    >
                                        Anterior
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={page >= totalPages || conversationsQuery.isFetching}
                                        onClick={() => goToPage(page + 1)}
                                    >
                                        Próxima
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </>
    );
}