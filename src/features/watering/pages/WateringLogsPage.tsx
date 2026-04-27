import { Droplets } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { PageHeader } from "@/shared/components/PageHeader";
import { RoutePlaceholder } from "@/shared/components/RoutePlaceholder";
import { Button } from "@/shared/components/ui/button";

export function WateringLogsPage() {
    const { plantId } = useParams();

    return (
        <>
            <PageHeader
                eyebrow="Regas"
                title={`Histórico de regas da planta ${plantId ?? ""}`}
                description="Histórico e criação de registros serão conectados aos endpoints de watering-logs no Bloco 6."
                actions={
                    <Button asChild variant="outline">
                        <Link to={`/app/plants/${plantId ?? "1"}`}>Voltar para planta</Link>
                    </Button>
                }
            />

            <RoutePlaceholder
                icon={<Droplets className="h-5 w-5" />}
                title="Regas preparadas"
                description="A tela vai listar regas, exibir resumo e permitir criar novo registro com data, quantidade e observações."
                bullets={[
                    "GET /plants/{plantId}/watering-logs",
                    "POST /plants/{plantId}/watering-logs",
                    "GET /plants/{plantId}/watering-summary",
                    "Validação local de data e quantidade"
                ]}
            />
        </>
    );
}