import { Leaf, LogOut, Sprout } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

import type { AuthUser } from "@/core/auth/authStore";
import { Button } from "@/shared/components/ui/button";
import {
    adminNavItems,
    mainNavItems,
    type AppNavItem
} from "@/shared/constants/navigation";
import { cn } from "@/shared/utils/cn";

type SidebarProps = {
    user: AuthUser | null;
    canSeeAdmin: boolean;
    isLoggingOut: boolean;
    onLogout: () => void;
};

type SidebarLinkProps = {
    item: AppNavItem;
};

type SidebarSectionProps = {
    title?: string;
    items: readonly AppNavItem[];
};

function normalizeText(value: string): string {
    return value
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

function shouldHideNavItem(item: AppNavItem): boolean {
    const label = normalizeText(item.label);
    const path = item.path.trim().toLowerCase();

    return (
        label.includes("especie") ||
        label.includes("configuracao") ||
        label.includes("configuracoes") ||
        path.includes("species") ||
        path.includes("especies") ||
        path.includes("settings") ||
        path.includes("configuracoes") ||
        path.includes("config")
    );
}

function getVisibleNavItems(items: readonly AppNavItem[]): readonly AppNavItem[] {
    return items.filter((item) => !shouldHideNavItem(item));
}

function SidebarLink({ item }: SidebarLinkProps) {
    const Icon = item.icon;

    return (
        <NavLink
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
                cn(
                    "group flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    isActive
                        ? "border-primary/20 bg-primary/10 text-primary shadow-sm"
                        : "border-transparent text-muted-foreground hover:border-primary/15 hover:bg-primary/5 hover:text-primary"
                )
            }
        >
            {({ isActive }) => (
                <>
                    <span
                        className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors",
                            isActive
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                        )}
                    >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>

                    <span className="truncate">{item.label}</span>
                </>
            )}
        </NavLink>
    );
}

function SidebarSection({ title, items }: SidebarSectionProps) {
    if (!items.length) {
        return null;
    }

    return (
        <section aria-label={title ?? "Navegação principal"} className="space-y-2">
            {title ? (
                <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {title}
                </p>
            ) : null}

            <div className="space-y-1">
                {items.map((item) => (
                    <SidebarLink key={item.path} item={item} />
                ))}
            </div>
        </section>
    );
}

export function Sidebar({
    user,
    canSeeAdmin,
    isLoggingOut,
    onLogout
}: SidebarProps) {
    const userName = user?.name?.trim() || "Usuário";
    const userEmail = user?.email?.trim() || "E-mail não informado";

    const visibleMainNavItems = getVisibleNavItems(mainNavItems);
    const visibleAdminNavItems = getVisibleNavItems(adminNavItems);

    return (
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-border/70 bg-background/95 backdrop-blur lg:flex lg:flex-col">
            <div className="p-4">
                <Link
                    to="/app"
                    className="group flex items-center gap-3 rounded-3xl p-3 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="Ir para o dashboard"
                >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
                        <Leaf className="h-5 w-5" aria-hidden="true" />
                    </span>

                    <span className="min-w-0">
                        <strong className="block truncate text-sm leading-tight text-foreground">
                            Estufa da Varanda
                        </strong>
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                            Gestão de plantas
                        </span>
                    </span>
                </Link>
            </div>

            <nav
                className="flex-1 space-y-6 overflow-y-auto px-4 py-1"
                aria-label="Menu lateral"
            >
                <SidebarSection items={visibleMainNavItems} />

                {canSeeAdmin && visibleAdminNavItems.length ? (
                    <SidebarSection title="Administração" items={visibleAdminNavItems} />
                ) : null}
            </nav>

            <div className="border-t border-border/70 p-4">
                {user ? (
                    <div
                        className="mb-3 rounded-3xl border border-border/70 bg-card p-3 shadow-sm"
                        title={userEmail}
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 text-primary">
                                <Sprout className="h-5 w-5" aria-hidden="true" />
                            </div>

                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-foreground">
                                    {userName}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                    {userEmail}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : null}

                <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full justify-center rounded-2xl border-border/70 text-muted-foreground transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                    disabled={isLoggingOut}
                    aria-busy={isLoggingOut}
                    onClick={onLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                    {isLoggingOut ? "Saindo..." : "Sair"}
                </Button>
            </div>
        </aside>
    );
}
