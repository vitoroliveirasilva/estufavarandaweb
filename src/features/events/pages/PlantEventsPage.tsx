import { ListChecks } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { PageHeader } from "@/shared/components/PageHeader";
import { RoutePlaceholder } from "@/shared/components/RoutePlaceholder";
import { Button } from "@/shared/components/ui/button";

export function PlantEventsPage() {
    const { plantId } = useParams();

    return (
        <>
            <PageHeader
                eyebrow="Eventos"
                title={`Cuidados e observações da planta ${plantId ?? ""}`}
                description="Eventos gerais serão conectados no Bloco 6 usando a rota /events."
                actions={
                    <Button asChild variant="outline">
                        <Link to={`/app/plants/${plantId ?? "1"}`}>Voltar para planta</Link>
                    </Button>
                }
            />

            <RoutePlaceholder
                icon={<ListChecks className="h-5 w-5" />}
                title="Eventos preparados"
                description="A tela vai listar observações, podas, adubações e outros cuidados registrados."
                bullets={[
                    "GET /plants/{plantId}/events",
                    "POST /plants/{plantId}/events",
                    "Filtro opcional por event_type",
                    "metadata_json tolerante a campos extras"
                ]}
            />
        </>
    );
}