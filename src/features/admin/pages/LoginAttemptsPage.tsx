import { Shield } from "lucide-react";

import { PageHeader } from "@/shared/components/PageHeader";
import { RoutePlaceholder } from "@/shared/components/RoutePlaceholder";

export function LoginAttemptsPage() {
    return (
        <>
            <PageHeader
                eyebrow="Admin"
                title="Tentativas de login"
                description="Auditoria de tentativas de login entra no Bloco 8."
            />

            <RoutePlaceholder
                icon={<Shield className="h-5 w-5" />}
                title="Auditoria preparada"
                description="A tela vai listar tentativas com e-mail, IP, user agent, status e data."
                bullets={[
                    "GET /admin/login-attempts",
                    "Paginação por page e page_size",
                    "Visível apenas para admin",
                    "Estados de loading, erro e vazio"
                ]}
            />
        </>
    );
}