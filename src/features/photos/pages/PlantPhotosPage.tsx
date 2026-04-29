import { ArrowLeft, Camera } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { usePlantDetail } from "@/features/plants/hooks/usePlants";
import { downloadPlantPhoto } from "@/features/photos/api/photosApi";
import { PhotoLightbox } from "@/features/photos/components/PhotoLightbox";
import { PhotoUploadForm } from "@/features/photos/components/PhotoUploadForm";
import { PhotosGrid } from "@/features/photos/components/PhotosGrid";
import {
    normalizePhotoUploadFormValues,
    useDeletePlantPhotoMutation,
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

    const [activePhotoId, setActivePhotoId] = useState<number | null>(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [previewErrorMessage, setPreviewErrorMessage] = useState<string | null>(null);
    const [previewUrls, setPreviewUrls] = useState<Record<number, string>>({});

    const previewUrlsRef = useRef<Record<number, string>>({});

    const photos = photosQuery.data?.items ?? [];

    useEffect(() => {
        return () => {
            Object.values(previewUrlsRef.current).forEach((url) => {
                URL.revokeObjectURL(url);
            });
        };
    }, []);

    useEffect(() => {
        const validIds = new Set(photos.map((photo) => photo.id));
        const currentEntries = previewUrlsRef.current;
        const staleIds = Object.keys(currentEntries)
            .map(Number)
            .filter((photoId) => !validIds.has(photoId));

        if (!staleIds.length) {
            return;
        }

        const nextEntries = { ...currentEntries };

        staleIds.forEach((photoId) => {
            const url = nextEntries[photoId];

            if (url) {
                URL.revokeObjectURL(url);
            }

            delete nextEntries[photoId];
        });

        previewUrlsRef.current = nextEntries;
        setPreviewUrls(nextEntries);
    }, [photos]);

    useEffect(() => {
        if (activePhotoId === null) {
            return;
        }

        const stillExists = photos.some((photo) => photo.id === activePhotoId);

        if (!stillExists) {
            setActivePhotoId(null);
            setIsPreviewOpen(false);
            setPreviewErrorMessage(null);
        }
    }, [photos, activePhotoId]);

    const activeIndex = useMemo(
        () => photos.findIndex((photo) => photo.id === activePhotoId),
        [photos, activePhotoId]
    );

    const activePhoto = activeIndex >= 0 ? photos[activeIndex] : null;
    const activeImageUrl = activePhoto ? previewUrls[activePhoto.id] ?? null : null;

    const total = photosQuery.data?.meta?.total ?? photos.length ?? 0;
    const totalPages =
        photosQuery.data?.meta?.total_pages ?? Math.max(1, Math.ceil(total / pageSize));
    const hasPhotos = photos.length > 0;
    const mutationError = deleteMutation.error;
    const isMutating =
        uploadMutation.isPending || deleteMutation.isPending || isPreviewLoading;

    const canGoPrevious = activeIndex > 0;
    const canGoNext = activeIndex >= 0 && activeIndex < photos.length - 1;

    const closePreview = useCallback(() => {
        setIsPreviewOpen(false);
        setActivePhotoId(null);
        setPreviewErrorMessage(null);
        setIsPreviewLoading(false);
    }, []);

    const removePreviewUrl = useCallback((photoId: number) => {
        const currentUrl = previewUrlsRef.current[photoId];

        if (!currentUrl) {
            return;
        }

        URL.revokeObjectURL(currentUrl);

        const nextEntries = { ...previewUrlsRef.current };
        delete nextEntries[photoId];

        previewUrlsRef.current = nextEntries;
        setPreviewUrls(nextEntries);
    }, []);

    const ensurePreviewUrl = useCallback(
        async (photoId: number): Promise<string> => {
            const cachedUrl = previewUrlsRef.current[photoId];

            if (cachedUrl) {
                return cachedUrl;
            }

            const blob = await downloadPlantPhoto(parsedPlantId, photoId);

            if (blob.size <= 0) {
                throw new Error("Arquivo da foto não encontrado.");
            }

            const objectUrl = URL.createObjectURL(blob);
            const nextEntries = {
                ...previewUrlsRef.current,
                [photoId]: objectUrl
            };

            previewUrlsRef.current = nextEntries;
            setPreviewUrls(nextEntries);

            return objectUrl;
        },
        [parsedPlantId]
    );

    const prefetchAroundIndex = useCallback(
        (index: number) => {
            const candidates = [photos[index - 1], photos[index + 1]].filter(Boolean);

            candidates.forEach((photo) => {
                if (!photo || previewUrlsRef.current[photo.id]) {
                    return;
                }

                void ensurePreviewUrl(photo.id).catch(() => {
                    // Prefetch silencioso.
                });
            });
        },
        [photos, ensurePreviewUrl]
    );

    async function openPreview(photoId: number) {
        const photoIndex = photos.findIndex((photo) => photo.id === photoId);

        if (photoIndex < 0) {
            return;
        }

        setPreviewErrorMessage(null);
        setActivePhotoId(photoId);
        setIsPreviewOpen(true);
        setIsPreviewLoading(true);

        try {
            await ensurePreviewUrl(photoId);
            prefetchAroundIndex(photoIndex);
        } catch (error) {
            setPreviewErrorMessage(getAppErrorMessage(error));
        } finally {
            setIsPreviewLoading(false);
        }
    }

    async function goToRelativePhoto(offset: -1 | 1) {
        if (activeIndex < 0) {
            return;
        }

        const nextIndex = activeIndex + offset;
        const nextPhoto = photos[nextIndex];

        if (!nextPhoto) {
            return;
        }

        setPreviewErrorMessage(null);
        setActivePhotoId(nextPhoto.id);
        setIsPreviewLoading(true);

        try {
            await ensurePreviewUrl(nextPhoto.id);
            prefetchAroundIndex(nextIndex);
        } catch (error) {
            setPreviewErrorMessage(getAppErrorMessage(error));
        } finally {
            setIsPreviewLoading(false);
        }
    }

    if (!parsedPlantId) {
        return (
            <ErrorState
                title="Planta inválida"
                description="O identificador informado na URL não é válido."
            />
        );
    }

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

    async function handleDelete(photoId: number) {
        const confirmed = window.confirm("Excluir esta foto? Esta ação não pode ser desfeita.");

        if (!confirmed) {
            return;
        }

        try {
            await deleteMutation.mutateAsync(photoId);
            removePreviewUrl(photoId);

            if (activePhotoId === photoId) {
                closePreview();
            }
        } catch {
            // O erro é exibido abaixo.
        }
    }

    function getPhotoDownloadFileName(photoId: number): string {
        return `planta-${parsedPlantId}-foto-${photoId}.jpg`;
    }

    function handleDownloadActivePhoto() {
        if (!activePhoto || !activeImageUrl) {
            return;
        }

        const link = document.createElement("a");
        link.href = activeImageUrl;
        link.download = getPhotoDownloadFileName(activePhoto.id);

        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    return (
        <>
            <PageHeader
                eyebrow="Fotos"
                title={`Fotos${plantQuery.data?.name ? ` · ${plantQuery.data.name}` : ""}`}
                description="Acompanhe a evolução da planta com uma galeria organizada e visualização completa na própria página."
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
                            photos={photos}
                            isMutating={isMutating}
                            onOpen={openPreview}
                            onDelete={handleDelete}
                        />

                        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-border/70 bg-card px-4 py-3 shadow-sm sm:flex-row">
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

            <PhotoLightbox
                isOpen={isPreviewOpen}
                photo={activePhoto}
                imageUrl={activeImageUrl}
                currentIndex={activeIndex >= 0 ? activeIndex : 0}
                total={photos.length}
                isLoading={isPreviewLoading}
                errorMessage={previewErrorMessage}
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
                onClose={closePreview}
                onPrevious={() => void goToRelativePhoto(-1)}
                onNext={() => void goToRelativePhoto(1)}
                onDownload={handleDownloadActivePhoto}
            />
        </>
    );
}
