import { zodResolver } from "@hookform/resolvers/zod";
import {
    FileText,
    HeartPulse,
    Leaf,
    Loader2,
    MapPin,
    Save,
    Sprout,
    SunMedium,
    Tag,
    Wind
} from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";

import {
    plantFormSchema,
    type PlantFormValues
} from "@/features/plants/schemas/plantSchemas";
import { FormErrorMessage } from "@/shared/components/FormErrorMessage";
import { Button } from "@/shared/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";

type PlantFormProps = {
    initialValues: PlantFormValues;
    submitLabel: string;
    isSubmitting?: boolean;
    apiErrorMessage?: string | null;
    onSubmit: (values: PlantFormValues) => Promise<void> | void;
};

type SelectOption = {
    value: string;
    label: string;
};

const healthStatusOptions = [
    { value: "", label: "Não informar" },
    { value: "healthy", label: "Saudável" },
    { value: "attention", label: "Atenção" },
    { value: "recovering", label: "Em recuperação" },
    { value: "critical", label: "Crítica" }
] as const satisfies readonly SelectOption[];

const environmentOptions = [
    { value: "", label: "Não informar" },
    { value: "indoor", label: "Interno" },
    { value: "outdoor", label: "Externo" },
    { value: "balcony", label: "Varanda" },
    { value: "greenhouse", label: "Estufa" },
    { value: "mixed", label: "Misto" }
] as const satisfies readonly SelectOption[];

const lightExposureOptions = [
    { value: "", label: "Não informar" },
    { value: "full_sun", label: "Sol pleno" },
    { value: "direct_sun", label: "Sol direto" },
    { value: "morning_sun", label: "Sol da manhã" },
    { value: "afternoon_sun", label: "Sol da tarde" },
    { value: "indirect_light", label: "Luz indireta" },
    { value: "filtered_light", label: "Luz filtrada" },
    { value: "shade", label: "Sombra" },
    { value: "low_light", label: "Pouca luz" }
] as const satisfies readonly SelectOption[];

const ventilationOptions = [
    { value: "", label: "Não informar" },
    { value: "sheltered", label: "Protegida" },
    { value: "low", label: "Baixa" },
    { value: "moderate", label: "Moderada" },
    { value: "airy", label: "Arejada" },
    { value: "windy", label: "Ventilada / com vento" }
] as const satisfies readonly SelectOption[];

const labelClassName = "text-sm font-medium text-foreground";

const fieldControlClassName =
    "h-full min-w-0 flex-1 border-0 bg-transparent px-0 py-0 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-70";

const selectControlClassName =
    "h-full min-w-0 flex-1 border-0 bg-transparent py-0 pl-0 pr-4 text-sm text-foreground outline-none disabled:cursor-not-allowed disabled:opacity-70";

const textareaClassName =
    "min-h-36 w-full resize-y rounded-2xl border border-input bg-background px-4 py-3 text-sm leading-7 text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground hover:border-primary/40 focus:border-primary/60 focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-70";

function getSelectOptions(
    options: readonly SelectOption[],
    currentValue?: string
): readonly SelectOption[] {
    const normalized = currentValue?.trim();

    if (!normalized || options.some((option) => option.value === normalized)) {
        return options;
    }

    return [
        ...options,
        {
            value: normalized,
            label: `Atual: ${normalized}`
        }
    ];
}

function renderOptions(options: readonly SelectOption[]) {
    return options.map((option) => (
        <option key={option.value || "empty"} value={option.value}>
            {option.label}
        </option>
    ));
}

function SectionIcon({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary/10 text-primary">
            {children}
        </div>
    );
}

function FieldShell({ children }: { children: ReactNode }) {
    return (
        <div className="group relative z-10 flex h-11 w-full items-center rounded-2xl border border-input bg-transparent px-3 shadow-sm transition-colors hover:border-primary/40 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15">
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

export function PlantForm({
    initialValues,
    submitLabel,
    isSubmitting = false,
    apiErrorMessage,
    onSubmit
}: PlantFormProps) {
    const form = useForm<PlantFormValues>({
        resolver: zodResolver(plantFormSchema),
        defaultValues: initialValues
    });

    const disabled = isSubmitting || form.formState.isSubmitting;

    const currentEnvironment = form.watch("environment");
    const currentLightExposure = form.watch("light_exposure");
    const currentVentilation = form.watch("ventilation");
    const currentHealthStatus = form.watch("health_status");

    useEffect(() => {
        form.reset(initialValues);
    }, [form, initialValues]);

    const handleSubmit = form.handleSubmit(async (values) => {
        await onSubmit(values);
    });

    return (
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {apiErrorMessage ? (
                <div
                    className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                    role="alert"
                >
                    {apiErrorMessage}
                </div>
            ) : null}

            <input type="hidden" {...form.register("species_profile_id")} />

            <Card className="overflow-visible border-border/70 bg-card shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-start gap-3">
                        <SectionIcon>
                            <Sprout className="h-5 w-5" />
                        </SectionIcon>

                        <div className="min-w-0">
                            <CardTitle className="text-lg">Identificação</CardTitle>
                            <CardDescription>
                                Nome, apelido e condição atual da planta.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                        <Label className={labelClassName} htmlFor="name">
                            Nome *
                        </Label>

                        <FieldShell>
                            <FieldIcon>
                                <Leaf className="h-4 w-4" />
                            </FieldIcon>

                            <input
                                id="name"
                                type="text"
                                autoComplete="off"
                                placeholder="Roseira"
                                disabled={disabled}
                                maxLength={120}
                                className={fieldControlClassName}
                                {...form.register("name")}
                            />
                        </FieldShell>

                        <FormErrorMessage message={form.formState.errors.name?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label className={labelClassName} htmlFor="nickname">
                            Apelido
                        </Label>

                        <FieldShell>
                            <FieldIcon>
                                <Tag className="h-4 w-4" />
                            </FieldIcon>

                            <input
                                id="nickname"
                                type="text"
                                autoComplete="off"
                                placeholder="Rosinha"
                                disabled={disabled}
                                maxLength={120}
                                className={fieldControlClassName}
                                {...form.register("nickname")}
                            />
                        </FieldShell>

                        <FormErrorMessage message={form.formState.errors.nickname?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label className={labelClassName} htmlFor="health_status">
                            Status de saúde
                        </Label>

                        <FieldShell>
                            <FieldIcon>
                                <HeartPulse className="h-4 w-4" />
                            </FieldIcon>

                            <select
                                id="health_status"
                                disabled={disabled}
                                className={selectControlClassName}
                                {...form.register("health_status")}
                            >
                                {renderOptions(
                                    getSelectOptions(healthStatusOptions, currentHealthStatus)
                                )}
                            </select>
                        </FieldShell>

                        <FormErrorMessage message={form.formState.errors.health_status?.message} />
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-visible border-border/70 bg-card shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-start gap-3">
                        <SectionIcon>
                            <MapPin className="h-5 w-5" />
                        </SectionIcon>

                        <div className="min-w-0">
                            <CardTitle className="text-lg">
                                Ambiente e localização
                            </CardTitle>
                            <CardDescription>
                                Onde ela fica e quais condições recebe no dia a dia.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label className={labelClassName} htmlFor="environment">
                            Ambiente
                        </Label>

                        <FieldShell>
                            <FieldIcon>
                                <MapPin className="h-4 w-4" />
                            </FieldIcon>

                            <select
                                id="environment"
                                disabled={disabled}
                                className={selectControlClassName}
                                {...form.register("environment")}
                            >
                                {renderOptions(
                                    getSelectOptions(environmentOptions, currentEnvironment)
                                )}
                            </select>
                        </FieldShell>

                        <FormErrorMessage message={form.formState.errors.environment?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label className={labelClassName} htmlFor="light_exposure">
                            Exposição de luz
                        </Label>

                        <FieldShell>
                            <FieldIcon>
                                <SunMedium className="h-4 w-4" />
                            </FieldIcon>

                            <select
                                id="light_exposure"
                                disabled={disabled}
                                className={selectControlClassName}
                                {...form.register("light_exposure")}
                            >
                                {renderOptions(
                                    getSelectOptions(lightExposureOptions, currentLightExposure)
                                )}
                            </select>
                        </FieldShell>

                        <FormErrorMessage message={form.formState.errors.light_exposure?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label className={labelClassName} htmlFor="ventilation">
                            Ventilação
                        </Label>

                        <FieldShell>
                            <FieldIcon>
                                <Wind className="h-4 w-4" />
                            </FieldIcon>

                            <select
                                id="ventilation"
                                disabled={disabled}
                                className={selectControlClassName}
                                {...form.register("ventilation")}
                            >
                                {renderOptions(
                                    getSelectOptions(ventilationOptions, currentVentilation)
                                )}
                            </select>
                        </FieldShell>

                        <FormErrorMessage message={form.formState.errors.ventilation?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label className={labelClassName} htmlFor="location_label">
                            Local
                        </Label>

                        <FieldShell>
                            <FieldIcon>
                                <MapPin className="h-4 w-4" />
                            </FieldIcon>

                            <input
                                id="location_label"
                                type="text"
                                autoComplete="off"
                                placeholder="Varanda"
                                disabled={disabled}
                                maxLength={160}
                                className={fieldControlClassName}
                                {...form.register("location_label")}
                            />
                        </FieldShell>

                        <FormErrorMessage message={form.formState.errors.location_label?.message} />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label className={labelClassName} htmlFor="city_name">
                            Cidade
                        </Label>

                        <FieldShell>
                            <FieldIcon>
                                <MapPin className="h-4 w-4" />
                            </FieldIcon>

                            <input
                                id="city_name"
                                type="text"
                                autoComplete="address-level2"
                                placeholder="Jundiaí"
                                disabled={disabled}
                                maxLength={160}
                                className={fieldControlClassName}
                                {...form.register("city_name")}
                            />
                        </FieldShell>

                        <FormErrorMessage message={form.formState.errors.city_name?.message} />
                    </div>
                </CardContent>
            </Card>

            <Card className="overflow-visible border-border/70 bg-card shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-start gap-3">
                        <SectionIcon>
                            <FileText className="h-5 w-5" />
                        </SectionIcon>

                        <div className="min-w-0">
                            <CardTitle className="text-lg">Observações</CardTitle>
                            <CardDescription>
                                Registre histórico, cuidados, sintomas ou qualquer detalhe importante.
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-2">
                    <Label className={labelClassName} htmlFor="notes">
                        Anotações sobre a planta
                    </Label>

                    <textarea
                        id="notes"
                        rows={5}
                        placeholder="Cadastro inicial, condição atual, histórico importante..."
                        disabled={disabled}
                        maxLength={2000}
                        className={textareaClassName}
                        {...form.register("notes")}
                    />

                    <FormErrorMessage message={form.formState.errors.notes?.message} />
                </CardContent>
            </Card>

            <Card className="border-border/70 bg-card shadow-sm">
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm leading-6 text-muted-foreground">
                        Revise as informações antes de salvar o cadastro da planta.
                    </p>

                    <Button
                        type="submit"
                        disabled={disabled}
                        className="h-11 w-full rounded-2xl px-6 text-sm font-semibold shadow-sm transition hover:shadow-md disabled:shadow-none sm:w-auto"
                    >
                        {disabled ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Salvando
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-4 w-4" />
                                {submitLabel}
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>
        </form>
    );
}
