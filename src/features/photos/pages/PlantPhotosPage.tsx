import { ArrowLeft, Camera } from "lucide-react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { usePlantDetail } from "@/features/plants/hooks/usePlants";
import { PhotoUploadForm } from "@/features/photos/components/PhotoUploadForm";
import { PhotosGrid } from "@/features/photos/components/PhotosGrid";
import {
    normalizePhotoUploadFormValues,
    useDeletePlantPhotoMutation,
    useDownloadPlantPhotoMutation,
    usePlantPhotos,
    useUploadPlantPhotoMutation
} from "@/features/photos/hooks/usePhotos";
import type { PhotoUploadFormValues } from "@/features/photos/schemas/photoSchemas";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorState } from "@/shared/components/ErrorState";
import { LoadingState } from "@/shared/components/LoadingState";
import { PageHeader } from "@/shared/components/PageHeader";
import { Button } from "@/shared/components/ui/button";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

function parsePositiveInt(
    value: string | null | undefined,
    fallback: number,
    max?: number
): number {
    if (!value) {
        return fallback;
    }

    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
        return fallback;
    }

    return typeof max === "number" ? Math.min(parsed, max) : parsed;
}

function openBlobInNewTab(blob: Blob, fallbackFilename: string): void {
    if (blob.size <= 0) {
        throw new Error("Arquivo da foto não encontrado.");
    }

    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = objectUrl;
    link.target = "_blank";
    link.download = fallbackFilename;
    link.rel = "noopener noreferrer";
    document.body.append(link);
    link.click();
    link.remove();

    window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
    }, 60_000);
}

export function PlantPhotosPage() {
    const { plantId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const parsedPlantId = parsePositiveInt(plantId, 0);
    const page = parsePositiveInt(searchParams.get("page"), DEFAULT_PAGE);
    const pageSize = parsePositiveInt(
        searchParams.get("page_size"),
        DEFAULT_PAGE_SIZE,
        MAX_PAGE_SIZE
    );

    const plantQuery = usePlantDetail(parsedPlantId, parsedPlantId > 0);
    const photosQuery = usePlantPhotos(parsedPlantId, {
        page,
        page_size: pageSize
    });

    const uploadMutation = useUploadPlantPhotoMutation(parsedPlantId);
    const deleteMutation = useDeletePlantPhotoMutation(parsedPlantId);
    const downloadMutation = useDownloadPlantPhotoMutation(parsedPlantId);

    if (!parsedPlantId) {
        return (
            <ErrorState
                title="Planta inválida"
                description="O identificador informado na URL não é válido."
            />
        );
    }

    const total = photosQuery.data?.meta?.total ?? photosQuery.data?.items.length ?? 0;
    const totalPages =
        photosQuery.data?.meta?.total_pages ?? Math.max(1, Math.ceil(total / pageSize));
    const hasPhotos = Boolean(photosQuery.data?.items.length);
    const mutationError = deleteMutation.error ?? downloadMutation.error;
    const isMutating =
        uploadMutation.isPending || deleteMutation.isPending || downloadMutation.isPending;

    function goToPage(nextPage: number) {
        const normalizedNextPage = Math.min(Math.max(nextPage, DEFAULT_PAGE), totalPages);
        const next = new URLSearchParams(searchParams);
        next.set("page", String(normalizedNextPage));
        next.set("page_size", String(pageSize));
        setSearchParams(next);
    }

    async function handleUpload(values: PhotoUploadFormValues) {
        await uploadMutation.mutateAsync(normalizePhotoUploadFormValues(values));
    }

    async function handleOpen(photoId: number) {
        try {
            const blob = await downloadMutation.mutateAsync(photoId);
            openBlobInNewTab(blob, `planta-${parsedPlantId}-foto-${photoId}`);
        } catch {
            // O erro é exibido abaixo.
        }
    }

    function handleDelete(photoId: number) {
        const confirmed = window.confirm("Excluir esta foto? Esta ação não pode ser desfeita.");

        if (!confirmed) {
            return;
        }

        deleteMutation.mutate(photoId);
    }

    return (
        <>
            <PageHeader
                eyebrow="Fotos"
                title={`Fotos${plantQuery.data?.name ? ` · ${plantQuery.data.name}` : ""}`}
                description="Galeria protegida, upload multipart e download autenticado."
                actions={
                    <Button asChild variant="outline">
                        <Link to={`/app/plants/${parsedPlantId}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar para planta
                        </Link>
                    </Button>
                }
            />

            <div className="space-y-5">
                <PhotoUploadForm
                    isSubmitting={uploadMutation.isPending}
                    apiErrorMessage={
                        uploadMutation.error ? getAppErrorMessage(uploadMutation.error) : null
                    }
                    onSubmit={handleUpload}
                />

                {mutationError ? (
                    <ErrorState
                        title="Não foi possível concluir a ação"
                        description={getAppErrorMessage(mutationError)}
                    />
                ) : null}

                {photosQuery.isLoading ? (
                    <LoadingState
                        title="Carregando fotos"
                        description="Buscando fotos da planta na API."
                    />
                ) : null}

                {photosQuery.isError ? (
                    <ErrorState
                        title="Não foi possível carregar as fotos"
                        description={getAppErrorMessage(photosQuery.error)}
                        actionLabel="Tentar novamente"
                        onAction={() => void photosQuery.refetch()}
                    />
                ) : null}

                {!photosQuery.isLoading && !photosQuery.isError && !hasPhotos ? (
                    <EmptyState
                        icon={<Camera className="h-6 w-6" />}
                        title="Nenhuma foto enviada"
                        description="Envie a primeira foto para criar a linha visual da evolução desta planta."
                    />
                ) : null}

                {hasPhotos ? (
                    <>
                        <PhotosGrid
                            photos={photosQuery.data?.items ?? []}
                            isMutating={isMutating}
                            onOpen={handleOpen}
                            onDelete={handleDelete}
                        />

                        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border bg-card px-4 py-3 sm:flex-row">
                            <p className="text-sm text-muted-foreground">
                                Página {page} de {totalPages} · {total} registro(s)
                            </p>

                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={page <= DEFAULT_PAGE || photosQuery.isFetching}
                                    onClick={() => goToPage(page - 1)}
                                >
                                    Anterior
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={page >= totalPages || photosQuery.isFetching}
                                    onClick={() => goToPage(page + 1)}
                                >
                                    Próxima
                                </Button>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
        </>
    );
}
