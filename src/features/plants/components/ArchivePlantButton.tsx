import { Archive, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getAppErrorMessage } from "@/core/api/apiError";
import { useArchivePlantMutation } from "@/features/plants/hooks/usePlants";
import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";

type ArchivePlantButtonProps = {
    plantId: number;
    plantName: string;
    archivedAt?: string | null;
};

export function ArchivePlantButton({
    plantId,
    plantName,
    archivedAt
}: ArchivePlantButtonProps) {
    const navigate = useNavigate();
    const archiveMutation = useArchivePlantMutation(plantId);
    const isArchived = Boolean(archivedAt);

    async function handleArchive() {
        const confirmed = window.confirm(
            `Arquivar "${plantName}"? Ela deixará de aparecer na listagem principal.`
        );

        if (!confirmed) {
            return;
        }

        try {
            await archiveMutation.mutateAsync();
            navigate("/app/plants", { replace: true });
        } catch {
            // Mensagem exibida abaixo.
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Zona de arquivamento</CardTitle>
                <CardDescription>
                    Arquivar usa DELETE /plants/{"{plantId}"} e mantém a semântica da API.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {archiveMutation.error ? (
                    <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                        {getAppErrorMessage(archiveMutation.error)}
                    </div>
                ) : null}

                <Button
                    type="button"
                    variant="destructive"
                    disabled={archiveMutation.isPending || isArchived}
                    onClick={handleArchive}
                >
                    {archiveMutation.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Arquivando
                        </>
                    ) : (
                        <>
                            <Archive className="mr-2 h-4 w-4" />
                            {isArchived ? "Planta arquivada" : "Arquivar planta"}
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}