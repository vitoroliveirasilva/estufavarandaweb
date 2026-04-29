import { useCallback } from "react";
import { Outlet } from "react-router-dom";

import { useAuthUser } from "@/core/auth/authStore";
import { useLogout } from "@/features/auth/hooks/useAuthActions";
import { MobileNav } from "@/shared/components/layout/MobileNav";
import { Sidebar } from "@/shared/components/layout/Sidebar";
import { Topbar } from "@/shared/components/layout/Topbar";

export function AuthenticatedLayout() {
    const user = useAuthUser();
    const { logout, isLoggingOut } = useLogout();

    const canSeeAdmin = user?.is_admin === true;

    const handleLogout = useCallback(() => {
        void logout();
    }, [logout]);

    return (
        <div className="relative min-h-screen bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.08),transparent_28rem),linear-gradient(180deg,hsl(var(--background)),hsl(var(--muted)/0.22))]">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-2xl focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-sm"
            >
                Pular para o conteúdo
            </a>

            <Sidebar
                user={user}
                canSeeAdmin={canSeeAdmin}
                isLoggingOut={isLoggingOut}
                onLogout={handleLogout}
            />

            <div className="lg:pl-72">
                <Topbar
                    user={user}
                    canSeeAdmin={canSeeAdmin}
                    isLoggingOut={isLoggingOut}
                    onLogout={handleLogout}
                />

                <MobileNav canSeeAdmin={canSeeAdmin} />

                <main
                    id="main-content"
                    className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8"
                    tabIndex={-1}
                >
                    <div className="mx-auto w-full max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
