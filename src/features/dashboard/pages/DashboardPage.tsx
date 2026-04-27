import { useAuthUser } from "@/core/auth/authStore";
import { DashboardPreparedModules } from "@/features/dashboard/components/DashboardPreparedModules";
import { DashboardQuickActions } from "@/features/dashboard/components/DashboardQuickActions";
import { DashboardStats } from "@/features/dashboard/components/DashboardStats";
import { WelcomePanel } from "@/features/dashboard/components/WelcomePanel";
import { PageHeader } from "@/shared/components/PageHeader";
import { SectionHeader } from "@/shared/components/SectionHeader";

export function DashboardPage() {
    const user = useAuthUser();

    return (
        <div className="space-y-8">
            <PageHeader
                eyebrow="Home"
                title="Dashboard"
                description="Visão inicial da Estufa da Varanda, com autenticação ativa e atalhos para os principais módulos do MVP."
            />

            <WelcomePanel user={user} />

            <section aria-label="Resumo do MVP">
                <SectionHeader
                    title="Resumo do MVP"
                    description="Estado atual da fundação web e das principais áreas do sistema."
                />
                <DashboardStats />
            </section>

            <section aria-label="Ações rápidas">
                <SectionHeader
                    title="Ações rápidas"
                    description="Atalhos principais para navegar pelo sistema."
                />
                <DashboardQuickActions />
            </section>

            <DashboardPreparedModules />
        </div>
    );
}
