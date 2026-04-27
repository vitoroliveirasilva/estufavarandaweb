import type { AuthUser } from "@/core/auth/authStore";
import {
    adminNavItems,
    mainNavItems,
    preparedNavItems,
    type AppNavItem
} from "@/shared/constants/navigation";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/utils/cn";
import { Leaf, LogOut } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

type SidebarProps = {
    user: AuthUser | null;
    canSeeAdmin: boolean;
    isLoggingOut: boolean;
    onLogout: () => void;
};

function SidebarLink({ item }: { item: AppNavItem }) {
    const Icon = item.icon;

    return (
        <NavLink
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
                cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                    isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )
            }
        >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="truncate">{item.label}</span>
        </NavLink>
    );
}

function SidebarSection({
    title,
    items
}: {
    title?: string;
    items: AppNavItem[];
}) {
    return (
        <div>
            {title ? (
                <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {title}
                </p>
            ) : null}

            <div className="space-y-1">
                {items.map((item) => (
                    <SidebarLink key={item.path} item={item} />
                ))}
            </div>
        </div>
    );
}

export function Sidebar({
    user,
    canSeeAdmin,
    isLoggingOut,
    onLogout
}: SidebarProps) {
    return (
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r bg-card/90 backdrop-blur lg:flex lg:flex-col">
            <div className="flex h-16 items-center gap-3 px-6">
                <Link to="/app" className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                        <Leaf className="h-5 w-5" />
                    </span>

                    <span>
                        <strong className="block leading-tight">Estufa</strong>
                        <span className="text-xs text-muted-foreground">da Varanda</span>
                    </span>
                </Link>
            </div>

            <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-4">
                <SidebarSection items={mainNavItems} />

                <Separator />

                <SidebarSection title="Preparados" items={preparedNavItems} />

                {canSeeAdmin ? (
                    <>
                        <Separator />
                        <SidebarSection title="Admin" items={adminNavItems} />
                    </>
                ) : null}
            </nav>

            <div className="space-y-4 border-t p-4">
                {user ? (
                    <div className="rounded-2xl bg-secondary p-3">
                        <p className="truncate text-sm font-medium">{user.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                ) : null}

                <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-start"
                    disabled={isLoggingOut}
                    onClick={onLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    {isLoggingOut ? "Saindo" : "Sair"}
                </Button>
            </div>
        </aside>
    );
}