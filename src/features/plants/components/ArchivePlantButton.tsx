import { Loader2, Trash2 } from "lucide-react";
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
    const deleteMutation = useArchivePlantMutation(plantId);
    const isDeleted = Boolean(archivedAt);
    const canDelete = Number.isInteger(plantId) && plantId > 0 && !isDeleted;

    async function handleDelete() {
        if (!canDelete || deleteMutation.isPending) {
            return;
        }

        const confirmed = window.confirm(
            `Excluir "${plantName}"? Esta planta deixará de aparecer na listagem principal.`
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteMutation.mutateAsync();
            navigate("/app/plants", { replace: true });
        } catch {
            // A mensagem é exibida abaixo.
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Zona de exclusão</CardTitle>
                <CardDescription>
                    Exclua a planta para removê-la da listagem principal.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                {deleteMutation.error ? (
                    <div
                        className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                        role="alert"
                    >
                        {getAppErrorMessage(deleteMutation.error)}
                    </div>
                ) : null}

                <Button
                    type="button"
                    variant="destructive"
                    disabled={!canDelete || deleteMutation.isPending}
                    onClick={handleDelete}
                >
                    {deleteMutation.isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Excluindo
                        </>
                    ) : (
                        <>
                            <Trash2 className="mr-2 h-4 w-4" />
                            {isDeleted ? "Planta excluída" : "Excluir planta"}
                        </>
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
