import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Download,
    FileText,
    Loader2,
    X
} from "lucide-react";
import { useEffect } from "react";

import type { PlantPhoto } from "@/features/photos/types/photoTypes";
import { Button } from "@/shared/components/ui/button";

type PhotoLightboxProps = {
    isOpen: boolean;
    photo: PlantPhoto | null;
    imageUrl?: string | null;
    currentIndex: number;
    total: number;
    isLoading?: boolean;
    errorMessage?: string | null;
    canGoPrevious: boolean;
    canGoNext: boolean;
    onClose: () => void;
    onPrevious: () => void;
    onNext: () => void;
    onDownload: () => void;
};

function formatDate(value: string | null): string {
    if (!value) {
        return "Não informado";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return format(date, "dd/MM/yyyy", {
        locale: ptBR
    });
}

function getPhotoTitle(photo: PlantPhoto): string {
    const caption = photo.caption?.trim();
    return caption || `Foto #${photo.id}`;
}

export function PhotoLightbox({
    isOpen,
    photo,
    imageUrl,
    currentIndex,
    total,
    isLoading = false,
    errorMessage,
    canGoPrevious,
    canGoNext,
    onClose,
    onPrevious,
    onNext,
    onDownload
}: PhotoLightboxProps) {
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }

            if (event.key === "ArrowLeft" && canGoPrevious) {
                event.preventDefault();
                onPrevious();
            }

            if (event.key === "ArrowRight" && canGoNext) {
                event.preventDefault();
                onNext();
            }
        }

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, canGoPrevious, canGoNext, onClose, onPrevious, onNext]);

    if (!isOpen || !photo) {
        return null;
    }

    const title = getPhotoTitle(photo);
    const canDownload = Boolean(imageUrl) && !isLoading && !errorMessage;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/70 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="mx-auto flex h-full max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-background shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-start justify-between gap-4 border-b border-border/70 bg-background/95 px-4 py-3 backdrop-blur">
                    <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-foreground">
                            {title}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {currentIndex + 1} de {total}
                        </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-2xl"
                            aria-label="Fechar visualização"
                            onClick={onClose}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_22rem]">
                    <div className="relative flex min-h-[22rem] items-center justify-center overflow-hidden bg-muted/20 px-4 py-4">
                        {canGoPrevious ? (
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="absolute left-4 top-1/2 z-10 h-11 w-11 -translate-y-1/2 rounded-full border-white/20 bg-black/35 text-white hover:bg-black/50 hover:text-white"
                                aria-label="Foto anterior"
                                onClick={onPrevious}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>
                        ) : null}

                        {canGoNext ? (
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="absolute right-4 top-1/2 z-10 h-11 w-11 -translate-y-1/2 rounded-full border-white/20 bg-black/35 text-white hover:bg-black/50 hover:text-white"
                                aria-label="Próxima foto"
                                onClick={onNext}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        ) : null}

                        {errorMessage ? (
                            <div className="max-w-md rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                {errorMessage}
                            </div>
                        ) : isLoading || !imageUrl ? (
                            <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <span>Carregando foto...</span>
                            </div>
                        ) : (
                            <img
                                src={imageUrl}
                                alt={title}
                                className="max-h-full max-w-full rounded-2xl object-contain shadow-sm"
                            />
                        )}
                    </div>

                    <aside className="flex flex-col gap-4 border-t border-border/70 bg-background px-5 py-5 lg:border-l lg:border-t-0">
                        <div>
                            <p className="text-sm font-semibold text-foreground">{title}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Registro visual da planta.
                            </p>
                        </div>

                        <Button
                            type="button"
                            disabled={!canDownload}
                            className="h-11 w-full rounded-2xl"
                            onClick={onDownload}
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Baixar foto
                        </Button>

                        <div className="rounded-2xl border border-border/70 bg-muted/20 px-4 py-3">
                            <div className="flex items-center gap-2 text-sm text-foreground">
                                <CalendarDays className="h-4 w-4 text-primary" />
                                <span className="font-medium">Data da foto</span>
                            </div>

                            <p className="mt-2 text-sm text-muted-foreground">
                                {formatDate(photo.taken_at)}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-border/70 bg-muted/20 px-4 py-3">
                            <div className="flex items-center gap-2 text-sm text-foreground">
                                <FileText className="h-4 w-4 text-primary" />
                                <span className="font-medium">Observações</span>
                            </div>

                            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                                {photo.notes?.trim() || "Sem observações registradas para esta foto."}
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
