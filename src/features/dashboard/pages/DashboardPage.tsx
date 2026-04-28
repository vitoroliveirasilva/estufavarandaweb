import { useAuthUser } from "@/core/auth/authStore";
import { DashboardPreparedModules } from "@/features/dashboard/components/DashboardPreparedModules";
import { DashboardQuickActions } from "@/features/dashboard/components/DashboardQuickActions";
import { PageHeader } from "@/shared/components/PageHeader";
import { SectionHeader } from "@/shared/components/SectionHeader";

export function DashboardPage() {
    const user = useAuthUser();

    return (
        <div className="space-y-7">
            <PageHeader
                eyebrow="Início"
                title={`Olá ${user?.name}!`}
            />

            <section aria-label="Ações rápidas" className="space-y-4">
                <SectionHeader
                    title="Ações rápidas"
                    description="Comece pelo que você mais usa no dia a dia."
                />
                <DashboardQuickActions />
            </section>

            <DashboardPreparedModules />
        </div>
    );
}
