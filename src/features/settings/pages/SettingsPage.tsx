import { Settings } from "lucide-react";

import { PageHeader } from "@/shared/components/PageHeader";
import { RoutePlaceholder } from "@/shared/components/RoutePlaceholder";

const SETTINGS_FEATURES = [
    "Sem endpoint obrigatório no MVP",
    "Pode receber preferências locais",
    "Pode exibir dados do usuário atual",
    "Pode listar dispositivos futuramente"
] as const;

export function SettingsPage() {
    return (
        <>
            <PageHeader
                eyebrow="Configurações"
                title="Configurações"
                description="Tela reservada para preferências futuras, conta, aparência e ajustes do site web."
            />

            <RoutePlaceholder
                icon={<Settings aria-hidden="true" className="h-5 w-5" />}
                title="Configurações preparadas"
                description="Este módulo já está reservado para preferências de tema, conta, dispositivos e ajustes visuais."
                bullets={SETTINGS_FEATURES}
            />
        </>
    );
}
