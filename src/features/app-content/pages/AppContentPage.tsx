import { ArrowLeft, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { AppContentDocument } from "@/features/app-content/components/AppContentDocument";
import { useAppContent } from "@/features/app-content/hooks/useAppContent";
import type { AppContentSlug } from "@/features/app-content/types/appContentTypes";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";

type AppContentPageProps = {
    fixedSlug?: AppContentSlug;
};

function normalizeSlug(value: string | null | undefined): string {
    return typeof value === "string" ? value.trim() : "";
}

function getFallbackTitle(slug: string): string {
    const titles: Record<string, string> = {
        "sobre-o-sistema": "Sobre o sistema",
        "politica-de-privacidade": "Política de privacidade",
        "termos-de-uso": "Termos de uso",
        "politica-de-cookies": "Política de cookies"
    };

    return titles[slug] ?? "Informações";
}

export function AppContentPage({ fixedSlug }: AppContentPageProps) {
    const navigate = useNavigate();
    const { slug } = useParams();

    const selectedSlug = useMemo(
        () => normalizeSlug(fixedSlug ?? slug),
        [fixedSlug, slug]
    );

    const appContentQuery = useAppContent(selectedSlug, undefined, selectedSlug.length > 0);
    const content = appContentQuery.data;

    if (!selectedSlug) {
        return (
            <ErrorState
                title="Conteúdo inválido"
                description="O identificador informado na URL não é válido."
            />
        );
    }

    return (
        <>
            <PageHeader
                eyebrow="Informações"
                title={content?.title ?? getFallbackTitle(selectedSlug)}
                actions={
                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            disabled={appContentQuery.isFetching}
                            onClick={() => void appContentQuery.refetch()}
                        >
                            <RefreshCw
                                className={
                                    appContentQuery.isFetching
                                        ? "mr-2 h-4 w-4 animate-spin"
                                        : "mr-2 h-4 w-4"
                                }
                            />
                            Atualizar
                        </Button>
                    </div>
                }
            />

            <div className="space-y-5">
                {appContentQuery.isPending ? (
                    <LoadingState
                        title="Carregando conteúdo"
                        description="Buscando as informações atualizadas na API."
                    />
                ) : null}

                {appContentQuery.isError ? (
                    <ErrorState
                        title="Não foi possível carregar este conteúdo"
                        description={getAppErrorMessage(appContentQuery.error)}
                        actionLabel="Tentar novamente"
                        onAction={() => void appContentQuery.refetch()}
                    />
                ) : null}

                {content ? <AppContentDocument content={content} /> : null}
            </div>
        </>
    );
}
