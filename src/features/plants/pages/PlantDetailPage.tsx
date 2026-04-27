import { Leaf } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { PageHeader } from "@/shared/components/PageHeader";
import { RoutePlaceholder } from "@/shared/components/RoutePlaceholder";
import { Button } from "@/shared/components/ui/button";

export function PlantDetailPage() {
    const { plantId } = useParams();

    return (
        <>
            <PageHeader
                eyebrow="Detalhe"
                title={`Planta ${plantId ?? ""}`}
                description="Detalhe tolerante a campos opcionais será conectado ao endpoint GET /plants/{plantId}."
                actions={
                    <>
                        <Button asChild variant="outline">
                            <Link to="/app/plants">Voltar</Link>
                        </Button>
                        <Button asChild>
                            <Link to={`/app/plants/${plantId ?? "1"}/edit`}>Editar</Link>
                        </Button>
                    </>
                }
            />

            <RoutePlaceholder
                icon={<Leaf className="h-5 w-5" />}
                title="Detalhe da planta preparado"
                description="Aqui entrarão resumo da planta, saúde, localização, espécie, atalhos de rega, eventos, fotos, clima e IA."
                bullets={[
                    "GET /plants/{plantId}",
                    "PATCH /plants/{plantId}",
                    "DELETE /plants/{plantId}",
                    "Links para regas, eventos, fotos, clima e IA"
                ]}
            />
        </>
    );
}