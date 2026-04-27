import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
    defaultWateringLogFormValues,
    wateringLogSchema,
    type WateringLogFormValues
} from "@/features/watering/schemas/wateringSchemas";
import { toDatetimeLocalValue } from "@/features/watering/hooks/useWatering";
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

type WateringLogFormProps = {
    isSubmitting?: boolean;
    apiErrorMessage?: string | null;
    onSubmit: (values: WateringLogFormValues) => Promise<void> | void;
};

export function WateringLogForm({
    isSubmitting = false,
    apiErrorMessage,
    onSubmit
}: WateringLogFormProps) {
    const form = useForm<WateringLogFormValues>({
        resolver: zodResolver(wateringLogSchema),
        defaultValues: {
            ...defaultWateringLogFormValues,
            watered_at: toDatetimeLocalValue()
        }
    });

    const disabled = isSubmitting || form.formState.isSubmitting;

    useEffect(() => {
        if (!form.getValues("watered_at")) {
            form.setValue("watered_at", toDatetimeLocalValue());
        }
    }, [form]);

    const handleSubmit = form.handleSubmit(async (values) => {
        await onSubmit(values);

        form.reset({
            ...defaultWateringLogFormValues,
            watered_at: toDatetimeLocalValue()
        });
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Registrar rega</CardTitle>
                <CardDescription>
                    Informe quando a planta foi regada, a quantidade aproximada e uma
                    observação opcional.
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
                        <Label htmlFor="watered_at">Data e hora *</Label>
                        <Input
                            id="watered_at"
                            type="datetime-local"
                            disabled={disabled}
                            {...form.register("watered_at")}
                        />
                        <FormErrorMessage message={form.formState.errors.watered_at?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="quantity_ml">Quantidade em ml</Label>
                        <Input
                            id="quantity_ml"
                            inputMode="numeric"
                            placeholder="300"
                            disabled={disabled}
                            {...form.register("quantity_ml")}
                        />
                        <FormErrorMessage message={form.formState.errors.quantity_ml?.message} />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="notes">Observações</Label>
                        <textarea
                            id="notes"
                            rows={4}
                            placeholder="Solo seco, rega leve, vaso drenou bem..."
                            disabled={disabled}
                            className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background transition placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...form.register("notes")}
                        />
                        <FormErrorMessage message={form.formState.errors.notes?.message} />
                    </div>

                    <div className="flex justify-end md:col-span-2">
                        <Button type="submit" disabled={disabled}>
                            {disabled ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Registrando
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Registrar rega
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}