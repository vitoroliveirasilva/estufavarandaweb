import { CloudSun } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { PageHeader } from "@/shared/components/PageHeader";
import { RoutePlaceholder } from "@/shared/components/RoutePlaceholder";
import { Button } from "@/shared/components/ui/button";

export function PlantClimatePage() {
    const { plantId } = useParams();

    return (
        <>
            <PageHeader
                eyebrow="Clima"
                title={`Clima da planta ${plantId ?? ""}`}
                description="Histórico climático por planta e resumo geral entram no Bloco 7."
                actions={
                    <Button asChild variant="outline">
                        <Link to={`/app/plants/${plantId ?? "1"}`}>Voltar para planta</Link>
                    </Button>
                }
            />

            <RoutePlaceholder
                icon={<CloudSun className="h-5 w-5" />}
                title="Clima preparado"
                description="A tela vai exibir temperatura, umidade, chuva, sensação térmica e índice UV quando disponíveis."
                bullets={[
                    "GET /plants/{plantId}/climate?limit=10",
                    "GET /climate/summary",
                    "Campos opcionais tratados com cuidado",
                    "Cards e histórico simples"
                ]}
            />
        </>
    );
}