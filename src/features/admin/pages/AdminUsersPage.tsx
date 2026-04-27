import { Users } from "lucide-react";

import { PageHeader } from "@/shared/components/PageHeader";
import { RoutePlaceholder } from "@/shared/components/RoutePlaceholder";

export function AdminUsersPage() {
    return (
        <>
            <PageHeader
                eyebrow="Admin"
                title="Usuários"
                description="Administração de usuários será condicionada por is_admin quando o fluxo de auth estiver pronto."
            />

            <RoutePlaceholder
                icon={<Users className="h-5 w-5" />}
                title="Admin de usuários preparado"
                description="A tela vai listar, criar, editar, ativar, desativar, resetar senha e revogar sessões."
                bullets={[
                    "GET /admin/users",
                    "POST /admin/users",
                    "PATCH /admin/users/{userId}",
                    "POST /admin/users/{userId}/revoke-sessions"
                ]}
            />
        </>
    );
}