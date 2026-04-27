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

    return (
        <div className="min-h-screen bg-background">
            <Sidebar
                user={user}
                canSeeAdmin={canSeeAdmin}
                isLoggingOut={isLoggingOut}
                onLogout={logout}
            />

            <div className="lg:pl-72">
                <Topbar
                    user={user}
                    canSeeAdmin={canSeeAdmin}
                    isLoggingOut={isLoggingOut}
                    onLogout={logout}
                />

                <MobileNav canSeeAdmin={canSeeAdmin} />

                <main className="px-4 py-6 sm:px-6 lg:px-8">
                    <div className="mx-auto w-full max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}