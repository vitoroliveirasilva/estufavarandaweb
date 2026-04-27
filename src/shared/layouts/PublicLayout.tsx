import { Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { Outlet } from "react-router-dom";

export function PublicLayout() {
    return (
        <main className="leaf-gradient min-h-screen">
            <div className="container grid min-h-screen items-center gap-10 py-10 lg:grid-cols-[1fr_430px]">
                <section className="hidden max-w-2xl space-y-8 lg:block">
                    <div className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur">
                        <Leaf className="h-4 w-4 text-primary" />
                        Estufa da Varanda
                    </div>

                    <div className="space-y-5">
                        <h1 className="text-5xl font-semibold tracking-tight text-foreground">
                            Suas plantas com histórico, cuidado e um tiquinho de método.
                        </h1>
                        <p className="max-w-xl text-lg leading-8 text-muted-foreground">
                            Uma interface web limpa para acompanhar plantas, regas, eventos,
                            notificações e próximos módulos da sua estufa digital.
                        </p>
                    </div>

                    <div className="grid max-w-xl gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border bg-card/80 p-5 shadow-soft backdrop-blur">
                            <ShieldCheck className="mb-4 h-6 w-6 text-primary" />
                            <h2 className="font-semibold">Sessão segura</h2>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                Preparado para JWT, refresh token e rotas protegidas nos
                                próximos blocos.
                            </p>
                        </div>

                        <div className="rounded-2xl border bg-card/80 p-5 shadow-soft backdrop-blur">
                            <Sparkles className="mb-4 h-6 w-6 text-primary" />
                            <h2 className="font-semibold">Pronto para crescer</h2>
                            <p className="mt-2 text-sm leading-6 text-muted-foreground">
                                Estrutura por features para plantas, fotos, clima, IA e admin.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-[430px]">
                    <Outlet />
                </section>
            </div>
        </main>
    );
}