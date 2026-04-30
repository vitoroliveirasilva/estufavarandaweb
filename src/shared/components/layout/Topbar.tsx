import { BadgeInfo, Bell, Leaf, LogOut, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import type { AuthUser } from "@/core/auth/authStore";
import { Button } from "@/shared/components/ui/button";

type TopbarProps = {
    user: AuthUser | null;
    canSeeAdmin: boolean;
    isLoggingOut: boolean;
    onLogout: () => void;
};

export function Topbar({
    user,
    canSeeAdmin,
    isLoggingOut,
    onLogout
}: TopbarProps) {
    const userName = user?.name?.trim() || "Usuário";

    return (
        <header className="sticky top-0 z-20 border-b border-border/70 bg-background/95 backdrop-blur">
            <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-3">
                    <Link
                        to="/app"
                        className="flex shrink-0 items-center gap-2 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 lg:hidden"
                        aria-label="Ir para o dashboard"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                            <Leaf className="h-4 w-4" aria-hidden="true" />
                        </span>

                        <span className="hidden font-semibold text-foreground xs:inline">
                            Estufa
                        </span>
                    </Link>

                    {user ? (
                        <div className="min-w-0">
                            {canSeeAdmin ? (
                                <div className="mb-0.5 flex items-center gap-1.5">
                                    <ShieldCheck
                                        className="h-4 w-4 shrink-0 text-primary"
                                        aria-hidden="true"
                                    />

                                    <p className="text-xs text-muted-foreground">
                                        Administrador
                                    </p>
                                </div>
                            ) : null}

                            <div className="mb-0.5 flex items-center gap-1.5">
                                {!canSeeAdmin ? (
                                    <ShieldCheck
                                        className="h-4 w-4 shrink-0 text-primary"
                                        aria-hidden="true"
                                    />
                                ) : null}

                                <p
                                    className="max-w-[10rem] truncate text-sm font-medium text-foreground sm:max-w-72"
                                    title={userName}
                                >
                                    {userName}
                                </p>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="ml-auto flex shrink-0 items-center gap-2">
                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-10 rounded-2xl border-border/70 bg-card shadow-sm transition-colors hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                    >
                        <Link to="/app/informacoes" aria-label="Abrir informações do sistema">
                            <BadgeInfo className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                            <span className="hidden sm:inline">Informações</span>
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        size="sm"
                        className="h-10 rounded-2xl border-border/70 bg-card shadow-sm transition-colors hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                    >
                        <Link to="/app/notifications" aria-label="Abrir notificações">
                            <Bell className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                            <span className="hidden sm:inline">Notificações</span>
                        </Link>
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isLoggingOut}
                        aria-busy={isLoggingOut}
                        className="h-10 rounded-2xl text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive lg:hidden"
                        onClick={onLogout}
                    >
                        <LogOut className="h-4 w-4 sm:mr-2" aria-hidden="true" />
                        <span className="hidden sm:inline">
                            {isLoggingOut ? "Saindo..." : "Sair"}
                        </span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
