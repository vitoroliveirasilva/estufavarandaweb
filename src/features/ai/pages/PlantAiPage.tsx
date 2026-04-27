import { Bot } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { PageHeader } from "@/shared/components/PageHeader";
import { RoutePlaceholder } from "@/shared/components/RoutePlaceholder";
import { Button } from "@/shared/components/ui/button";

export function PlantAiPage() {
    const { plantId } = useParams();

    return (
        <>
            <PageHeader
                eyebrow="IA"
                title={`Assistente da planta ${plantId ?? ""}`}
                description="Perguntas para IA e histórico de conversas entram no Bloco 8."
                actions={
                    <Button asChild variant="outline">
                        <Link to={`/app/plants/${plantId ?? "1"}`}>Voltar para planta</Link>
                    </Button>
                }
            />

            <RoutePlaceholder
                icon={<Bot className="h-5 w-5" />}
                title="IA preparada"
                description="A tela vai permitir perguntar sobre a planta e listar conversas anteriores."
                bullets={[
                    "POST /plants/{plantId}/ai/ask",
                    "GET /plants/{plantId}/ai/conversations",
                    "Resposta tolerante ao objeto retornado pela API",
                    "Histórico paginado"
                ]}
            />
        </>
    );
}