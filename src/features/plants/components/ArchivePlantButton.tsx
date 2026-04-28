import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
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
            `Excluir "${plantName}"?\n\nA planta será removida da listagem principal.`
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
        <Card className="border-destructive/20 bg-background shadow-sm">
            <CardHeader className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 space-y-1.5">
                        <CardTitle className="flex items-center gap-2 text-base font-semibold leading-none text-foreground">
                            <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
                            Excluir planta
                        </CardTitle>

                        <CardDescription className="max-w-3xl text-sm leading-6">
                            Remove a planta da listagem principal. Use apenas se não quiser mais acompanhar este cadastro.
                        </CardDescription>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        disabled={!canDelete || deleteMutation.isPending}
                        onClick={handleDelete}
                        className="w-full shrink-0 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground sm:w-auto"
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
                </div>
            </CardHeader>

            {deleteMutation.error || isDeleted ? (
                <CardContent className="px-5 pb-5 pt-0">
                    {deleteMutation.error ? (
                        <div
                            className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                            role="alert"
                        >
                            {getAppErrorMessage(deleteMutation.error)}
                        </div>
                    ) : null}

                    {isDeleted ? (
                        <div className="rounded-xl border bg-background px-4 py-3 text-sm text-muted-foreground">
                            Esta planta já foi removida da listagem principal.
                        </div>
                    ) : null}
                </CardContent>
            ) : null}
        </Card>
    );
}
