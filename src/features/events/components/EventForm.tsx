import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
    defaultPlantEventFormValues,
    plantEventSchema,
    type PlantEventFormValues
} from "@/features/events/schemas/eventSchemas";
import { toDatetimeLocalValue } from "@/features/events/hooks/usePlantEvents";
import { FormErrorMessage } from "@/shared/components/FormErrorMessage";
import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

type EventFormProps = {
    isSubmitting?: boolean;
    apiErrorMessage?: string | null;
    onSubmit: (values: PlantEventFormValues) => Promise<void> | void;
};

export function EventForm({
    isSubmitting = false,
    apiErrorMessage,
    onSubmit
}: EventFormProps) {
    const form = useForm<PlantEventFormValues>({
        resolver: zodResolver(plantEventSchema),
        defaultValues: {
            ...defaultPlantEventFormValues,
            occurred_at: toDatetimeLocalValue()
        }
    });

    const disabled = isSubmitting || form.formState.isSubmitting;

    useEffect(() => {
        if (!form.getValues("occurred_at")) {
            form.setValue("occurred_at", toDatetimeLocalValue());
        }
    }, [form]);

    const handleSubmit = form.handleSubmit(async (values) => {
        await onSubmit(values);

        form.reset({
            ...defaultPlantEventFormValues,
            occurred_at: toDatetimeLocalValue()
        });
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Criar evento ou cuidado</CardTitle>
                <CardDescription>
                    Use eventos para registrar observações, cuidados e mudanças importantes
                    na planta.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit} noValidate>
                    {apiErrorMessage ? (
                        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive md:col-span-2">
                            {apiErrorMessage}
                        </div>
                    ) : null}

                    <div className="space-y-2">
                        <Label htmlFor="event_type">Tipo *</Label>
                        <Input
                            id="event_type"
                            placeholder="observation"
                            disabled={disabled}
                            {...form.register("event_type")}
                        />
                        <p className="text-xs leading-5 text-muted-foreground">
                            Use <strong>observation</strong> para observações gerais.
                        </p>
                        <FormErrorMessage message={form.formState.errors.event_type?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="occurred_at">Data e hora *</Label>
                        <Input
                            id="occurred_at"
                            type="datetime-local"
                            disabled={disabled}
                            {...form.register("occurred_at")}
                        />
                        <FormErrorMessage message={form.formState.errors.occurred_at?.message} />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="title">Título *</Label>
                        <Input
                            id="title"
                            placeholder="Observação inicial"
                            disabled={disabled}
                            {...form.register("title")}
                        />
                        <FormErrorMessage message={form.formState.errors.title?.message} />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="description">Descrição</Label>
                        <textarea
                            id="description"
                            rows={4}
                            placeholder="Folhas firmes, substrato seco, brotação nova..."
                            disabled={disabled}
                            className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...form.register("description")}
                        />
                        <FormErrorMessage message={form.formState.errors.description?.message} />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="metadata_json">Metadados JSON</Label>
                        <textarea
                            id="metadata_json"
                            rows={4}
                            placeholder='{"source":"web"}'
                            disabled={disabled}
                            className="flex w-full rounded-xl border border-input bg-background px-3 py-2 font-mono text-sm ring-offset-background transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...form.register("metadata_json")}
                        />
                        <FormErrorMessage message={form.formState.errors.metadata_json?.message} />
                    </div>

                    <div className="flex justify-end md:col-span-2">
                        <Button type="submit" disabled={disabled}>
                            {disabled ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Criando
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Criar evento
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}