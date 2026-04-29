import {
    Leaf,
    LockKeyhole,
    ShieldCheck,
    Sparkles,
    Sprout
} from "lucide-react";
import { Outlet } from "react-router-dom";

export function PublicLayout() {
    return (
        <main
            className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.14),transparent_32rem),linear-gradient(135deg,hsl(var(--background)),hsl(var(--muted)/0.45))]"
            aria-labelledby="public-layout-title"
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-primary/10 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-primary/5 blur-3xl"
            />

            <div className="container relative grid min-h-screen items-center gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_27rem] lg:py-10">
                <section
                    className="hidden max-w-2xl space-y-8 lg:block"
                    aria-describedby="public-layout-description"
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/85 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur">
                        <Leaf className="h-4 w-4 text-primary" aria-hidden="true" />
                        Estufa da Varanda
                    </div>

                    <div className="space-y-5">
                        <h1
                            id="public-layout-title"
                            className="max-w-3xl text-5xl font-semibold tracking-tight text-foreground"
                        >
                            Cuide das suas plantas com histórico, contexto e um pouco
                            menos de adivinhação.
                        </h1>

                        <p
                            id="public-layout-description"
                            className="max-w-xl text-lg leading-8 text-muted-foreground"
                        >
                            Organize plantas, regas, eventos, fotos, clima,
                            notificações e consultas com IA em uma experiência simples
                            para acompanhamento.
                        </p>
                    </div>
                </section>

                <section
                    className="mx-auto w-full max-w-[430px]"
                    aria-label="Área de autenticação"
                >
                    <div className="mb-8 flex items-center justify-center gap-3 lg:hidden">
                        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                            <Leaf className="h-5 w-5" aria-hidden="true" />
                        </span>

                        <span>
                            <strong className="block leading-tight text-foreground">
                                Estufa
                            </strong>
                            <span className="text-xs text-muted-foreground">
                                da Varanda
                            </span>
                        </span>
                    </div>

                    <div className="rounded-[2rem] border border-border/70 bg-card/90 p-3 shadow-sm backdrop-blur">
                        <div className="mb-3 flex items-center justify-between rounded-3xl border border-border/70 bg-muted/20 px-4 py-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-primary/15 bg-background text-primary">
                                    <Sprout className="h-5 w-5" aria-hidden="true" />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-foreground">
                                        Bem-vindo
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Acesse sua estufa
                                    </p>
                                </div>
                            </div>

                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-border/70 bg-background text-muted-foreground">
                                <LockKeyhole className="h-4 w-4" aria-hidden="true" />
                            </div>
                        </div>

                        <Outlet />
                    </div>
                </section>
            </div>
        </main>
    );
}
