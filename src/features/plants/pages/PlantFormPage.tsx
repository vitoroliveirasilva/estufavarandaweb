import { ArrowLeft } from "lucide-react";
import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { PlantForm } from "@/features/plants/components/PlantForm";
import {
    defaultPlantFormValues,
    type PlantFormValues
} from "@/features/plants/schemas/plantSchemas";
import {
    normalizePlantFormValues,
    useCreatePlantMutation,
    usePlantDetail,
    useUpdatePlantMutation
} from "@/features/plants/hooks/usePlants";
import type { PlantDetail } from "@/features/plants/types/plantTypes";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";

type PlantFormPageProps = {
    mode: "create" | "edit";
};

function parsePlantId(value: string | undefined): number | null {
    if (!value) {
        return null;
    }

    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function toStringValue(value: unknown): string {
    if (typeof value === "string") {
        return value;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
        return String(value);
    }

    return "";
}

function plantToFormValues(plant: PlantDetail): PlantFormValues {
    return {
        name: toStringValue(plant.name),
        nickname: toStringValue(plant.nickname),
        environment: toStringValue(plant.environment),
        light_exposure: toStringValue(plant.light_exposure),
        ventilation: toStringValue(plant.ventilation),
        location_label: toStringValue(plant.location_label),
        city_name: toStringValue(plant.city_name),
        notes: toStringValue(plant.notes),
        health_status: toStringValue(plant.health_status)
    };
}

export function PlantFormPage({ mode }: PlantFormPageProps) {
    const navigate = useNavigate();
    const { plantId } = useParams();
    const isEdit = mode === "edit";
    const parsedPlantId = parsePlantId(plantId);

    const plantQuery = usePlantDetail(parsedPlantId, isEdit);
    const createMutation = useCreatePlantMutation();
    const updateMutation = useUpdatePlantMutation(parsedPlantId ?? 0);

    const editInitialValues = useMemo(
        () => (plantQuery.data ? plantToFormValues(plantQuery.data) : null),
        [plantQuery.data]
    );

    const mutationError = createMutation.error ?? updateMutation.error;
    const isSubmitting = createMutation.isPending || updateMutation.isPending;

    if (isEdit && !parsedPlantId) {
        return (
            <ErrorState
                title="Planta inválida"
                description="O identificador informado na URL não é válido."
            />
        );
    }

    async function handleSubmit(values: PlantFormValues) {
        const payload = normalizePlantFormValues(values);

        if (isEdit) {
            if (!parsedPlantId) {
                return;
            }

            await updateMutation.mutateAsync(payload);
            navigate(`/app/plants/${parsedPlantId}`, { replace: true });
            return;
        }

        const created = await createMutation.mutateAsync(payload);
        navigate(`/app/plants/${created.id}`, { replace: true });
    }

    const title = isEdit ? "Editar planta" : "Cadastrar planta";
    const cancelPath = isEdit ? `/app/plants/${parsedPlantId ?? ""}` : "/app/plants";

    return (
        <>
            <PageHeader
                title={title}
                actions={
                    <Button asChild variant="outline">
                        <Link to={cancelPath}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Cancelar
                        </Link>
                    </Button>
                }
            />

            {isEdit && plantQuery.isLoading ? (
                <LoadingState
                    title="Carregando planta"
                    description="Buscando dados para edição."
                />
            ) : null}

            {isEdit && plantQuery.isError ? (
                <ErrorState
                    title="Não foi possível carregar a planta"
                    description={getAppErrorMessage(plantQuery.error)}
                    actionLabel="Tentar novamente"
                    onAction={() => void plantQuery.refetch()}
                />
            ) : null}

            {!isEdit ? (
                <PlantForm
                    initialValues={defaultPlantFormValues}
                    submitLabel="Cadastrar planta"
                    isSubmitting={isSubmitting}
                    apiErrorMessage={mutationError ? getAppErrorMessage(mutationError) : null}
                    onSubmit={handleSubmit}
                />
            ) : null}

            {isEdit && editInitialValues ? (
                <PlantForm
                    initialValues={editInitialValues}
                    submitLabel="Salvar alterações"
                    isSubmitting={isSubmitting}
                    apiErrorMessage={mutationError ? getAppErrorMessage(mutationError) : null}
                    onSubmit={handleSubmit}
                />
            ) : null}
        </>
    );
}
