import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarDays, Eye, Image, Trash2 } from "lucide-react";

import type { PlantPhoto } from "@/features/photos/types/photoTypes";
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
    onOpen: (photoId: number) => Promise<void> | void;
    onDelete: (photoId: number) => Promise<void> | void;
};

function formatDate(value: string | null): string {
    if (!value) {
        return "Data não informada";
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

export function PhotoCard({
    photo,
    isMutating = false,
    onOpen,
    onDelete
}: PhotoCardProps) {
    const title = getPhotoTitle(photo);

    return (
        <Card className="group flex h-full flex-col overflow-hidden border-border/70 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <CardHeader className="pb-3">
                <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-background text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <Image className="h-6 w-6" aria-hidden="true" />
                    </div>

                    <div className="inline-flex items-center rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                        <CalendarDays className="mr-1.5 h-3.5 w-3.5 text-primary" />
                        {formatDate(photo.taken_at)}
                    </div>
                </div>

                <CardTitle className="line-clamp-2 text-base leading-6">
                    {title}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col justify-between gap-5 pt-0">
                <div className="space-y-3">
                    <div className="rounded-2xl border border-border/70 bg-muted/20 px-4 py-3">
                        <p className="line-clamp-4 whitespace-pre-wrap break-words text-sm leading-6 text-muted-foreground">
                            {photo.notes?.trim() || "Sem observações registradas para esta foto."}
                        </p>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Enviada em {formatDate(photo.uploaded_at)}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button
                        type="button"
                        className="h-10 flex-1 rounded-2xl"
                        disabled={isMutating}
                        onClick={() => void onOpen(photo.id)}
                    >
                        <Eye className="mr-2 h-4 w-4" aria-hidden="true" />
                        Visualizar
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-10 w-10 rounded-2xl border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        disabled={isMutating}
                        aria-label={`Excluir ${title}`}
                        onClick={() => void onDelete(photo.id)}
                    >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
