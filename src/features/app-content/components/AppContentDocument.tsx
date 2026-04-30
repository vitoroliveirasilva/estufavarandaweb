import {
    BadgeInfo,
    CheckCircle2,
    Cookie,
    FileText,
    Leaf,
    ShieldCheck,
    Sparkles,
    Sprout
} from "lucide-react";
import type { ElementType } from "react";

import type {
    AppContentDetail,
    AppContentSection
} from "@/features/app-content/types/appContentTypes";
import { Card, CardContent } from "@/shared/components/ui/card";

type AppContentDocumentProps = {
    content: AppContentDetail;
};

type SectionCardProps = {
    section: AppContentSection;
    index: number;
};

const iconByName: Record<string, ElementType> = {
    "badge-info": BadgeInfo,
    cookie: Cookie,
    "file-text": FileText,
    leaf: Leaf,
    "shield-check": ShieldCheck,
    sprout: Sprout
};

function getIcon(iconName: string): ElementType {
    return iconByName[iconName] ?? BadgeInfo;
}

function getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
        institutional: "Institucional",
        legal: "Legal",
        support: "Suporte"
    };

    return labels[category] ?? "Informativo";
}

function SectionCard({ section, index }: SectionCardProps) {
    const isFeatured = index === 0;

    return (
        <article
            className={
                isFeatured
                    ? "rounded-[2rem] border border-primary/20 bg-primary/5 p-5 shadow-sm sm:p-6"
                    : "rounded-[2rem] border border-border/70 bg-card p-5 shadow-sm transition-shadow duration-200 hover:shadow-[0_14px_40px_rgba(15,23,42,0.08)] sm:p-6"
            }
        >
            <div className="flex items-start gap-4">
                <div
                    className={
                        isFeatured
                            ? "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm"
                            : "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 text-primary shadow-sm"
                    }
                >
                    <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                </div>

                <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        Ponto {String(index + 1).padStart(2, "0")}
                    </p>

                    <h2 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
                        {section.title}
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                        {section.body}
                    </p>
                </div>
            </div>
        </article>
    );
}

export function AppContentDocument({ content }: AppContentDocumentProps) {
    const Icon = getIcon(content.icon);
    const hasSections = content.sections.length > 0;

    return (
        <div className="space-y-8">
            <section className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card shadow-sm">
                <div className="absolute right-0 top-0 h-56 w-56 translate-x-16 -translate-y-16 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-44 w-44 -translate-x-16 translate-y-16 rounded-full bg-primary/5 blur-3xl" />

                <CardContent className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-center lg:p-10">
                    <div className="max-w-3xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                            {getCategoryLabel(content.category)}
                        </div>

                        <div className="mt-6 flex items-start gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-sm">
                                <Icon className="h-7 w-7" aria-hidden="true" />
                            </div>

                            <div className="min-w-0">
                                <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                                    {content.title}
                                </h1>

                                <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
                                    {content.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </section>

            {hasSections ? (
                <section className="grid gap-4 lg:grid-cols-2">
                    {content.sections.map((section, index) => (
                        <SectionCard
                            key={`${section.title}-${index}`}
                            section={section}
                            index={index}
                        />
                    ))}
                </section>
            ) : (
                <Card className="overflow-hidden rounded-[2rem] border-border/70 bg-card shadow-sm">
                    <CardContent className="p-6 sm:p-8">
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 text-primary">
                                <BadgeInfo className="h-6 w-6" aria-hidden="true" />
                            </div>

                            <h2 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
                                Informação disponível
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-muted-foreground">
                                {content.content}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
