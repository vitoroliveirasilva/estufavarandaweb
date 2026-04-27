import { Settings } from "lucide-react";

import { PageHeader } from "@/shared/components/PageHeader";
import { RoutePlaceholder } from "@/shared/components/RoutePlaceholder";

export function SettingsPage() {
    return (
        <>
            <PageHeader
                eyebrow="Configurações"
                title="Configurações"
                description="Tela reservada para preferências futuras do site web."
            />

            <RoutePlaceholder
                icon={<Settings className="h-5 w-5" />}
                title="Configurações preparadas"
                description="Aqui podem entrar preferências de tema, conta, dispositivos e ajustes visuais."
                bullets={[
                    "Sem endpoint obrigatório no MVP",
                    "Pode receber preferências locais",
                    "Pode exibir dados do usuário atual",
                    "Pode listar dispositivos futuramente"
                ]}
            />
        </>
    );
}