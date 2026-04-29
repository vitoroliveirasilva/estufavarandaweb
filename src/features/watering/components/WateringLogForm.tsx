import { zodResolver } from "@hookform/resolvers/zod";
import {
    CalendarDays,
    Clock3,
    Droplets,
    FileText,
    Loader2,
    Plus,
    Ruler,
    Sparkles
} from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";

import {
    toDateInputValue,
    toTimeInputValue
} from "@/features/watering/hooks/useWatering";
import {
    defaultWateringLogFormValues,
    wateringLogSchema,
    type WateringLogFormValues
} from "@/features/watering/schemas/wateringSchemas";
import { FormErrorMessage } from "@/shared/components/FormErrorMessage";
import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";

type WateringLogFormProps = {
    isSubmitting?: boolean;
    apiErrorMessage?: string | null;
    onSubmit: (values: WateringLogFormValues) => Promise<void> | void;
};

const amountSuggestions = ["100", "250", "500", "750", "1000"] as const;

const labelClassName = "text-sm font-medium text-foreground";

const fieldControlClassName =
    "h-full min-w-0 flex-1 border-0 bg-transparent px-0 py-0 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-70";

const textareaClassName =
    "min-h-32 w-full resize-y rounded-2xl border border-input bg-background px-4 py-3 text-sm leading-7 text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground hover:border-primary/40 focus:border-primary/60 focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-70";

function SectionIcon({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-background text-primary shadow-sm">
            {children}
        </div>
    );
}

function FieldShell({ children }: { children: ReactNode }) {
    return (
        <div className="group relative flex h-11 w-full items-center rounded-2xl border border-input bg-background px-3 shadow-sm transition-colors hover:border-primary/40 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15">
            {children}
        </div>
    );
}

function FieldIcon({ children }: { children: ReactNode }) {
    return (
        <div className="mr-3 flex h-full w-5 shrink-0 items-center justify-center text-muted-foreground transition-colors group-focus-within:text-primary">
            {children}
        </div>
    );
}

export function WateringLogForm({
    isSubmitting = false,
    apiErrorMessage,
    onSubmit
}: WateringLogFormProps) {
    const form = useForm<WateringLogFormValues>({
        resolver: zodResolver(wateringLogSchema),
        defaultValues: {
            ...defaultWateringLogFormValues,
            watered_date: toDateInputValue(),
            watered_time: toTimeInputValue()
        },
        mode: "onBlur"
    });

    const disabled = isSubmitting || form.formState.isSubmitting;

    useEffect(() => {
        if (!form.getValues("watered_date")) {
            form.setValue("watered_date", toDateInputValue(), {
                shouldDirty: false,
                shouldTouch: false,
                shouldValidate: false
            });
        }

        if (!form.getValues("watered_time")) {
            form.setValue("watered_time", toTimeInputValue(), {
                shouldDirty: false,
                shouldTouch: false,
                shouldValidate: false
            });
        }
    }, [form]);

    const handleSubmit = form.handleSubmit(async (values) => {
        try {
            await onSubmit(values);

            form.reset({
                ...defaultWateringLogFormValues,
                watered_date: toDateInputValue(),
                watered_time: toTimeInputValue()
            });
        } catch {
            // A mensagem é exibida pelo apiErrorMessage.
        }
    });

    function useCurrentDateTime() {
        form.setValue("watered_date", toDateInputValue(), {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        });

        form.setValue("watered_time", toTimeInputValue(), {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        });
    }

    function setQuantitySuggestion(value: string) {
        form.setValue("quantity_ml", value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        });
    }

    return (
        <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
            <CardHeader className="border-b bg-muted/20 pb-4">
                <div className="flex items-center gap-3">
                    <SectionIcon>
                        <Droplets className="h-5 w-5" />
                    </SectionIcon>

                    <div className="min-w-0 space-y-1">
                        <CardTitle className="text-lg">Registrar rega</CardTitle>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4">
                <form
                    className="grid gap-5 md:grid-cols-2"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    {apiErrorMessage ? (
                        <div
                            className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive md:col-span-2"
                            role="alert"
                        >
                            {apiErrorMessage}
                        </div>
                    ) : null}

                    <div className="rounded-3xl border border-border/70 bg-background p-4 shadow-sm md:col-span-2">
                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/5 text-primary">
                                    <Clock3 className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="font-semibold text-foreground">
                                        Momento da rega
                                    </p>
                                </div>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                disabled={disabled}
                                className="h-10 rounded-2xl px-4"
                                onClick={useCurrentDateTime}
                            >
                                Usar agora
                            </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className={labelClassName} htmlFor="watered_date">
                                    Data *
                                </Label>

                                <FieldShell>
                                    <FieldIcon>
                                        <CalendarDays className="h-4 w-4" />
                                    </FieldIcon>

                                    <input
                                        id="watered_date"
                                        type="date"
                                        disabled={disabled}
                                        aria-invalid={Boolean(
                                            form.formState.errors.watered_date
                                        )}
                                        className={fieldControlClassName}
                                        {...form.register("watered_date")}
                                    />
                                </FieldShell>

                                <FormErrorMessage
                                    message={form.formState.errors.watered_date?.message}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className={labelClassName} htmlFor="watered_time">
                                    Horário *
                                </Label>

                                <FieldShell>
                                    <FieldIcon>
                                        <Clock3 className="h-4 w-4" />
                                    </FieldIcon>

                                    <input
                                        id="watered_time"
                                        type="time"
                                        disabled={disabled}
                                        aria-invalid={Boolean(
                                            form.formState.errors.watered_time
                                        )}
                                        className={fieldControlClassName}
                                        {...form.register("watered_time")}
                                    />
                                </FieldShell>

                                <FormErrorMessage
                                    message={form.formState.errors.watered_time?.message}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label className={labelClassName} htmlFor="quantity_ml">
                            Quantidade em ml
                        </Label>

                        <FieldShell>
                            <FieldIcon>
                                <Ruler className="h-4 w-4" />
                            </FieldIcon>

                            <input
                                id="quantity_ml"
                                inputMode="numeric"
                                placeholder="Ex.: 300"
                                disabled={disabled}
                                aria-invalid={Boolean(form.formState.errors.quantity_ml)}
                                autoComplete="off"
                                className={fieldControlClassName}
                                {...form.register("quantity_ml")}
                            />
                        </FieldShell>

                        <div className="flex flex-wrap gap-2 pt-1">
                            {amountSuggestions.map((amount) => (
                                <button
                                    key={amount}
                                    type="button"
                                    disabled={disabled}
                                    className="rounded-full border border-border/70 bg-background px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-70"
                                    onClick={() => setQuantitySuggestion(amount)}
                                >
                                    {amount} ml
                                </button>
                            ))}
                        </div>

                        <FormErrorMessage
                            message={form.formState.errors.quantity_ml?.message}
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label className={labelClassName} htmlFor="notes">
                            Observações
                        </Label>

                        <div className="relative">
                            <FileText className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-muted-foreground" />

                            <textarea
                                id="notes"
                                rows={4}
                                maxLength={500}
                                placeholder="Solo seco, rega leve, vaso drenou bem..."
                                disabled={disabled}
                                aria-invalid={Boolean(form.formState.errors.notes)}
                                className={`${textareaClassName} pl-11`}
                                {...form.register("notes")}
                            />
                        </div>

                        <FormErrorMessage message={form.formState.errors.notes?.message} />
                    </div>

                    <div className="md:col-span-2">
                        <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-background p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-3">
                                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                <p className="text-sm leading-6 text-muted-foreground">
                                    Registros de rega funcionam como histórico. Depois de salvar,
                                    eles aparecem abaixo em formato de leitura.
                                </p>
                            </div>

                            <Button
                                type="submit"
                                disabled={disabled}
                                className="h-11 w-full rounded-2xl px-6 text-sm font-semibold shadow-sm transition hover:shadow-md disabled:shadow-none sm:w-auto"
                            >
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
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
