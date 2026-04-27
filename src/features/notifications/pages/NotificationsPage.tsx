import { Bell } from "lucide-react";

import { PageHeader } from "@/shared/components/PageHeader";
import { RoutePlaceholder } from "@/shared/components/RoutePlaceholder";

export function NotificationsPage() {
    return (
        <>
            <PageHeader
                eyebrow="Notificações"
                title="Central de notificações"
                description="Listagem, leitura e descarte de notificações entram no Bloco 7."
            />

            <RoutePlaceholder
                icon={<Bell className="h-5 w-5" />}
                title="Notificações preparadas"
                description="A tela vai consumir a lista paginada e permitir ações individuais por notificação."
                bullets={[
                    "GET /notifications?page=1&page_size=20",
                    "PATCH /notifications/{notificationId}/read",
                    "PATCH /notifications/{notificationId}/discard",
                    "Filtro opcional por status"
                ]}
            />
        </>
    );
}