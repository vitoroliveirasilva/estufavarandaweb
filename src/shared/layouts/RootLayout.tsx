import {
    Bell,
    Bot,
    Camera,
    CloudSun,
    LayoutDashboard,
    Leaf,
    ListChecks,
    LogOut,
    Settings,
    Shield,
    Sprout,
    Users,
    Waves
} from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";

import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { cn } from "@/shared/utils/cn";

type NavItem = {
    label: string;
    path: string;
    icon: React.ComponentType<{ className?: string }>;
};

const mainNavItems: NavItem[] = [
    {
        label: "Dashboard",
        path: "/app",
        icon: LayoutDashboard
    },
    {
        label: "Minhas plantas",
        path: "/app/plants",
        icon: Sprout
    },
    {
        label: "Espécies",
        path: "/app/species",
        icon: Leaf
    },
    {
        label: "Notificações",
        path: "/app/notifications",
        icon: Bell
    },
    {
        label: "Configurações",
        path: "/app/settings",
        icon: Settings
    }
];

const preparedItems: NavItem[] = [
    {
        label: "Fotos",
        path: "/app/plants/1/photos",
        icon: Camera
    },
    {
        label: "Clima",
        path: "/app/plants/1/climate",
        icon: CloudSun
    },
    {
        label: "IA",
        path: "/app/plants/1/ai",
        icon: Bot
    },
    {
        label: "Regas",
        path: "/app/plants/1/watering",
        icon: Waves
    },
    {
        label: "Eventos",
        path: "/app/plants/1/events",
        icon: ListChecks
    }
];

const adminItems: NavItem[] = [
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
];

function SidebarLink({ item }: { item: NavItem }) {
    const Icon = item.icon;

    return (
        <NavLink
            to={item.path}
            end={item.path === "/app"}
            className={({ isActive }) =>
                cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition",
                    isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )
            }
        >
            <Icon className="h-4 w-4" />
            {item.label}
        </NavLink>
    );
}

export function RootLayout() {
    return (
        <div className="min-h-screen bg-background">
            <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r bg-card/85 backdrop-blur lg:flex lg:flex-col">
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
                    <div className="space-y-1">
                        {mainNavItems.map((item) => (
                            <SidebarLink key={item.path} item={item} />
                        ))}
                    </div>

                    <Separator />

                    <div>
                        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Preparados
                        </p>
                        <div className="space-y-1">
                            {preparedItems.map((item) => (
                                <SidebarLink key={item.path} item={item} />
                            ))}
                        </div>
                    </div>

                    <Separator />

                    <div>
                        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Admin
                        </p>
                        <div className="space-y-1">
                            {adminItems.map((item) => (
                                <SidebarLink key={item.path} item={item} />
                            ))}
                        </div>
                    </div>
                </nav>

                <div className="border-t p-4">
                    <Button asChild variant="outline" className="w-full justify-start">
                        <Link to="/login">
                            <LogOut className="mr-2 h-4 w-4" />
                            Sair
                        </Link>
                    </Button>
                </div>
            </aside>

            <div className="lg:pl-72">
                <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
                    <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                        <Link to="/app" className="flex items-center gap-2 lg:hidden">
                            <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                                <Leaf className="h-4 w-4" />
                            </span>
                            <span className="font-semibold">Estufa</span>
                        </Link>

                        <div className="hidden lg:block">
                            <p className="text-sm font-medium">MVP Web</p>
                            <p className="text-xs text-muted-foreground">
                                Setup inicial pronto para conectar na API.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Button asChild variant="ghost" size="sm">
                                <Link to="/app/notifications">
                                    <Bell className="mr-2 h-4 w-4" />
                                    Notificações
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <nav className="flex gap-2 overflow-x-auto border-t px-4 py-2 lg:hidden">
                        {mainNavItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === "/app"}
                                className={({ isActive }) =>
                                    cn(
                                        "whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary text-muted-foreground"
                                    )
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </header>

                <main className="px-4 py-6 sm:px-6 lg:px-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}