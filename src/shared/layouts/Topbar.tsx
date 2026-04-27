import type { AuthUser } from "@/core/auth/authStore";
import { Button } from "@/shared/components/ui/button";
import { Bell, Leaf, LogOut, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

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
    return (
        <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
            <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <Link to="/app" className="flex items-center gap-2 lg:hidden">
                    <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                        <Leaf className="h-4 w-4" />
                    </span>
                    <span className="font-semibold">Estufa</span>
                </Link>

                <div className="hidden lg:block">
                    <p className="text-sm font-medium">Painel web</p>
                    <p className="text-xs text-muted-foreground">
                        Acompanhe plantas, cuidados e histórico em um só lugar.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {user ? (
                        <div className="hidden text-right sm:block">
                            <div className="flex items-center justify-end gap-2">
                                <p className="text-sm font-medium">{user.name}</p>
                                {canSeeAdmin ? (
                                    <ShieldCheck className="h-4 w-4 text-primary" />
                                ) : null}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {canSeeAdmin ? "Administrador" : "Usuário"}
                            </p>
                        </div>
                    ) : null}

                    <Button asChild variant="ghost" size="sm">
                        <Link to="/app/notifications">
                            <Bell className="mr-2 h-4 w-4" />
                            Notificações
                        </Link>
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isLoggingOut}
                        className="lg:hidden"
                        onClick={onLogout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                    </Button>
                </div>
            </div>
        </header>
    );
}