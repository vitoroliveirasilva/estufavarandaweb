import {
    ArrowRight,
    BookOpenText,
    CalendarDays,
    Cookie,
    FileText,
    Info,
    RefreshCw,
    ShieldCheck,
    Sprout
} from "lucide-react";
import type { ElementType } from "react";
import { Link } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { useAppContentList } from "@/features/app-content/hooks/useAppContent";
import type { AppContentSummary } from "@/features/app-content/types/appContentTypes";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";

const iconByName: Record<string, ElementType> = {
    cookie: Cookie,
    "file-text": FileText,
    "shield-check": ShieldCheck,
    sprout: Sprout
};

function getIcon(iconName: string): ElementType {
    return iconByName[iconName] ?? Info;
}

function getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
        institutional: "Institucional",
        legal: "Legal",
        support: "Suporte"
    };

    return labels[category] ?? "Informativo";
}

function getCategoryDescription(category: string): string {
    const descriptions: Record<string, string> = {
        institutional: "Informações gerais sobre o sistema",
        legal: "Documentos, políticas e condições de uso",
        support: "Ajuda e orientações para uso"
    };

    return descriptions[category] ?? "Conteúdo oficial da plataforma";
}

function getCategoryClasses(category: string): {
    card: string;
    icon: string;
    badge: string;
    glow: string;
} {
    if (category === "legal") {
        return {
            card: "hover:border-primary/30",
            icon: "border-primary/15 bg-primary/10 text-primary",
            badge: "border-primary/20 bg-primary/5 text-primary",
            glow: "bg-primary/10"
        };
    }

    if (category === "support") {
        return {
            card: "hover:border-primary/30",
            icon: "border-primary/15 bg-primary/10 text-primary",
            badge: "border-primary/20 bg-primary/5 text-primary",
            glow: "bg-primary/10"
        };
    }

    return {
        card: "hover:border-primary/30",
        icon: "border-primary/15 bg-primary/10 text-primary",
        badge: "border-primary/20 bg-primary/5 text-primary",
        glow: "bg-primary/10"
    };
}

function formatDate(value: string): string | null {
    if (!value) {
        return null;
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    }).format(date);
}

function AppContentCard({ item }: { item: AppContentSummary }) {
    const Icon = getIcon(item.icon);
    const updatedAt = formatDate(item.updated_at);
    const classes = getCategoryClasses(item.category);

    return (
        <Link
            to={`/app/informacoes/${item.slug}`}
            className="group block h-full rounded-[2rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            aria-label={`Abrir ${item.title}`}
        >
            <Card
                className={`relative h-full overflow-hidden rounded-[2rem] border-border/70 bg-card shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_50px_rgba(15,23,42,0.10)] ${classes.card}`}
            >
                <div
                    className={`pointer-events-none absolute right-0 top-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-100 ${classes.glow}`}
                />

                <CardContent className="relative flex h-full flex-col p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-4">
                        <div
                            className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-3xl border shadow-sm transition-transform duration-300 group-hover:scale-105 ${classes.icon}`}
                        >
                            <Icon className="h-6 w-6" aria-hidden="true" />
                        </div>

                        <span
                            className={`inline-flex shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${classes.badge}`}
                        >
                            {getCategoryLabel(item.category)}
                        </span>
                    </div>

                    <div className="mt-6 min-w-0">
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                            {getCategoryDescription(item.category)}
                        </p>

                        <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                            {item.title}
                        </h2>

                        <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted-foreground">
                            {item.description}
                        </p>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                            <BookOpenText className="mr-1.5 h-3.5 w-3.5" />
                            v{item.version}
                        </span>

                        {updatedAt ? (
                            <span className="inline-flex items-center rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                                <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                                {updatedAt}
                            </span>
                        ) : null}
                    </div>

                    <div className="mt-auto pt-6">
                        <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-muted/20 px-4 py-3 transition-colors duration-300 group-hover:border-primary/20 group-hover:bg-primary/5">
                            <span className="text-sm font-medium text-foreground">
                                Ver conteúdo
                            </span>

                            <span className="flex h-9 w-9 items-center justify-center rounded-2xl text-primary transition-transform duration-300 group-hover:translate-x-1">
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

export function AppContentListPage() {
    const appContentQuery = useAppContentList();
    const items = appContentQuery.data ?? [];
    const hasItems = items.length > 0;

    return (
        <>
            <PageHeader
                eyebrow="Informações"
                title="Conteúdos oficiais"
                actions={
                    <Button
                        type="button"
                        variant="outline"
                        disabled={appContentQuery.isFetching}
                        className="h-10 rounded-2xl"
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
                }
            />

            <div className="space-y-6">
                {appContentQuery.isPending ? (
                    <LoadingState
                        title="Carregando conteúdos"
                        description="Buscando páginas institucionais e políticas do sistema."
                    />
                ) : null}

                {appContentQuery.isError ? (
                    <ErrorState
                        title="Não foi possível carregar os conteúdos"
                        description={getAppErrorMessage(appContentQuery.error)}
                        actionLabel="Tentar novamente"
                        onAction={() => void appContentQuery.refetch()}
                    />
                ) : null}

                {!appContentQuery.isPending && !appContentQuery.isError && !hasItems ? (
                    <EmptyState
                        icon={<Info className="h-6 w-6" />}
                        title="Nenhum conteúdo encontrado"
                        description="Quando houver páginas disponíveis na API, elas aparecerão aqui."
                    />
                ) : null}

                {hasItems ? (
                    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {items.map((item) => (
                            <AppContentCard key={item.slug} item={item} />
                        ))}
                    </section>
                ) : null}
            </div>
        </>
    );
}
