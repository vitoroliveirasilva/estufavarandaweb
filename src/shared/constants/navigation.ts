import type { LucideIcon } from "lucide-react";
import {
    Bell,
    LayoutDashboard,
    Shield,
    Sprout,
    Users
} from "lucide-react";

export type AppNavItem = {
    readonly label: string;
    readonly path: string;
    readonly icon: LucideIcon;
    readonly exact?: boolean;
};

export const mainNavItems = [
    {
        label: "Dashboard",
        path: "/app",
        icon: LayoutDashboard,
        exact: true
    },
    {
        label: "Minhas plantas",
        path: "/app/plants",
        icon: Sprout
    },
    {
        label: "Notificações",
        path: "/app/notifications",
        icon: Bell
    }
] as const satisfies readonly AppNavItem[];

export const preparedNavItems = [] as const satisfies readonly AppNavItem[];

export const adminNavItems = [
    {
        label: "Usuários",
        path: "/app/admin/users",
        icon: Users
    },
    {
        label: "Tentativas de login",
        path: "/app/admin/login-attempts",
        icon: Shield
    }
] as const satisfies readonly AppNavItem[];
