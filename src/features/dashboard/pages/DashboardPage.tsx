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
                description="Visão inicial do site web da Estufa da Varanda, com autenticação ativa e módulos preparados para integração."
            />

            <WelcomePanel user={user} />

            <section>
                <SectionHeader
                    title="Resumo do MVP"
                    description="Estado atual da fundação web antes da integração das features de domínio."
                />
                <DashboardStats />
            </section>

            <section>
                <SectionHeader
                    title="Ações rápidas"
                    description="Atalhos principais para navegar pelo MVP."
                />
                <DashboardQuickActions />
            </section>

            <DashboardPreparedModules />
        </div>
    );
}