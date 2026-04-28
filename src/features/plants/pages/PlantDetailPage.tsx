import { ArrowLeft, Pencil } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { ArchivePlantButton } from "@/features/plants/components/ArchivePlantButton";
import { PlantDetailSummary } from "@/features/plants/components/PlantDetailSummary";
import { PlantQuickLinks } from "@/features/plants/components/PlantQuickLinks";
import { usePlantDetail } from "@/features/plants/hooks/usePlants";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";

function parsePlantId(value: string | undefined): number | null {
    if (!value) {
        return null;
    }

    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

export function PlantDetailPage() {
    const { plantId } = useParams();
    const parsedPlantId = parsePlantId(plantId);
    const plantQuery = usePlantDetail(parsedPlantId);

    if (!parsedPlantId) {
        return (
            <ErrorState
                title="Planta inválida"
                description="O identificador informado na URL não é válido."
            />
        );
    }

    const plant = plantQuery.data;

    return (
        <>
            <PageHeader
                eyebrow="Detalhe"
                title={plant?.name ?? "Detalhe da planta"}
                description="Dados detalhados da planta e atalhos para cuidados relacionados."
                actions={
                    <>
                        <Button asChild variant="outline">
                            <Link to="/app/plants">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar
                            </Link>
                        </Button>

                        <Button asChild>
                            <Link to={`/app/plants/${parsedPlantId}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                            </Link>
                        </Button>
                    </>
                }
            />

            <div className="space-y-5">
                {plantQuery.isLoading ? (
                    <LoadingState
                        title="Carregando planta"
                        description="Buscando detalhes atualizados na API."
                    />
                ) : null}

                {plantQuery.isError ? (
                    <ErrorState
                        title="Não foi possível carregar a planta"
                        description={getAppErrorMessage(plantQuery.error)}
                        actionLabel="Tentar novamente"
                        onAction={() => void plantQuery.refetch()}
                    />
                ) : null}

                {plant ? (
                    <>
                        <PlantDetailSummary plant={plant} />

                        <PlantQuickLinks plantId={parsedPlantId} />

                        <ArchivePlantButton
                            plantId={parsedPlantId}
                            plantName={plant.name}
                            archivedAt={plant.archived_at}
                        />
                    </>
                ) : null}
            </div>
        </>
    );
}
