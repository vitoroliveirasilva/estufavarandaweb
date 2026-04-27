import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, Download, Image, Trash2 } from "lucide-react";

import type { PlantPhoto } from "@/features/photos/types/photoTypes";
import { StatusBadge } from "@/shared/components/StatusBadge";
import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

type PhotoCardProps = {
    photo: PlantPhoto;
    isMutating?: boolean;
    onOpen: (photoId: number) => void;
    onDelete: (photoId: number) => void;
};

function formatDateTime(value: string | null): string {
    if (!value) {
        return "Não informado";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return format(date, "dd/MM/yyyy HH:mm", {
        locale: ptBR
    });
}

export function PhotoCard({
    photo,
    isMutating = false,
    onOpen,
    onDelete
}: PhotoCardProps) {
    return (
        <Card className="flex h-full flex-col">
            <CardHeader>
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                        <Image className="h-6 w-6" />
                    </div>

                    <StatusBadge tone="neutral">{photo.photo_type || "routine"}</StatusBadge>
                </div>

                <CardTitle className="line-clamp-2 text-base">
                    {photo.caption || `Foto #${photo.id}`}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col justify-between gap-5">
                <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 shrink-0" />
                        <span>Tirada em: {formatDateTime(photo.taken_at)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 shrink-0" />
                        <span>Enviada em: {formatDateTime(photo.uploaded_at)}</span>
                    </div>

                    <p className="whitespace-pre-wrap leading-6">
                        {photo.notes?.trim() || "Sem notas."}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        type="button"
                        className="flex-1"
                        disabled={isMutating}
                        onClick={() => onOpen(photo.id)}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Abrir
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={isMutating}
                        aria-label="Excluir foto"
                        onClick={() => onDelete(photo.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}