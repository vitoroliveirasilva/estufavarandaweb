import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
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
import { Input } from "@/shared/components/ui/input";
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
        <Card>
            <CardHeader>
                <CardTitle>Dados da planta</CardTitle>
                <CardDescription>
                    Informe os dados principais. Campos vazios não serão enviados para a API.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form className="grid gap-5 md:grid-cols-2" onSubmit={handleSubmit} noValidate>
                    {apiErrorMessage ? (
                        <div
                            className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive md:col-span-2"
                            role="alert"
                        >
                            {apiErrorMessage}
                        </div>
                    ) : null}

                    <input type="hidden" {...form.register("species_profile_id")} />

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="name">Nome *</Label>
                        <Input
                            id="name"
                            autoComplete="off"
                            placeholder="Roseira"
                            disabled={disabled}
                            maxLength={120}
                            {...form.register("name")}
                        />
                        <FormErrorMessage message={form.formState.errors.name?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nickname">Apelido</Label>
                        <Input
                            id="nickname"
                            autoComplete="off"
                            placeholder="Rosinha"
                            disabled={disabled}
                            maxLength={120}
                            {...form.register("nickname")}
                        />
                        <FormErrorMessage message={form.formState.errors.nickname?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="health_status">Status de saúde</Label>
                        <select
                            id="health_status"
                            disabled={disabled}
                            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...form.register("health_status")}
                        >
                            {renderOptions(getSelectOptions(healthStatusOptions, currentHealthStatus))}
                        </select>
                        <FormErrorMessage message={form.formState.errors.health_status?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="environment">Ambiente</Label>
                        <select
                            id="environment"
                            disabled={disabled}
                            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...form.register("environment")}
                        >
                            {renderOptions(getSelectOptions(environmentOptions, currentEnvironment))}
                        </select>
                        <FormErrorMessage message={form.formState.errors.environment?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="light_exposure">Exposição de luz</Label>
                        <select
                            id="light_exposure"
                            disabled={disabled}
                            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...form.register("light_exposure")}
                        >
                            {renderOptions(getSelectOptions(lightExposureOptions, currentLightExposure))}
                        </select>
                        <FormErrorMessage message={form.formState.errors.light_exposure?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ventilation">Ventilação</Label>
                        <select
                            id="ventilation"
                            disabled={disabled}
                            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...form.register("ventilation")}
                        >
                            {renderOptions(getSelectOptions(ventilationOptions, currentVentilation))}
                        </select>
                        <FormErrorMessage message={form.formState.errors.ventilation?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location_label">Local</Label>
                        <Input
                            id="location_label"
                            autoComplete="off"
                            placeholder="Varanda"
                            disabled={disabled}
                            maxLength={160}
                            {...form.register("location_label")}
                        />
                        <FormErrorMessage message={form.formState.errors.location_label?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="city_name">Cidade</Label>
                        <Input
                            id="city_name"
                            autoComplete="address-level2"
                            placeholder="Jundiaí"
                            disabled={disabled}
                            maxLength={160}
                            {...form.register("city_name")}
                        />
                        <FormErrorMessage message={form.formState.errors.city_name?.message} />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="notes">Observações</Label>
                        <textarea
                            id="notes"
                            rows={5}
                            placeholder="Cadastro inicial, condição atual, histórico importante..."
                            disabled={disabled}
                            maxLength={2000}
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
                                    Salvando
                                </>
                            ) : (
                                submitLabel
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
