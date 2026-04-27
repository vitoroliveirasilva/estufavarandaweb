import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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

const healthStatusOptions = [
    {
        value: "",
        label: "Não informar"
    },
    {
        value: "healthy",
        label: "Saudável"
    },
    {
        value: "attention",
        label: "Atenção"
    },
    {
        value: "recovering",
        label: "Em recuperação"
    },
    {
        value: "critical",
        label: "Crítica"
    }
];

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
                        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive md:col-span-2">
                            {apiErrorMessage}
                        </div>
                    ) : null}

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="name">Nome *</Label>
                        <Input
                            id="name"
                            placeholder="Roseira"
                            disabled={disabled}
                            {...form.register("name")}
                        />
                        <FormErrorMessage message={form.formState.errors.name?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nickname">Apelido</Label>
                        <Input
                            id="nickname"
                            placeholder="Rosinha"
                            disabled={disabled}
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
                            {healthStatusOptions.map((option) => (
                                <option key={option.value || "empty"} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <FormErrorMessage message={form.formState.errors.health_status?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="environment">Ambiente</Label>
                        <Input
                            id="environment"
                            placeholder="outdoor"
                            disabled={disabled}
                            {...form.register("environment")}
                        />
                        <FormErrorMessage message={form.formState.errors.environment?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="light_exposure">Exposição de luz</Label>
                        <Input
                            id="light_exposure"
                            placeholder="afternoon_sun"
                            disabled={disabled}
                            {...form.register("light_exposure")}
                        />
                        <FormErrorMessage
                            message={form.formState.errors.light_exposure?.message}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ventilation">Ventilação</Label>
                        <Input
                            id="ventilation"
                            placeholder="airy"
                            disabled={disabled}
                            {...form.register("ventilation")}
                        />
                        <FormErrorMessage message={form.formState.errors.ventilation?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location_label">Local</Label>
                        <Input
                            id="location_label"
                            placeholder="Varanda"
                            disabled={disabled}
                            {...form.register("location_label")}
                        />
                        <FormErrorMessage
                            message={form.formState.errors.location_label?.message}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="city_name">Cidade</Label>
                        <Input
                            id="city_name"
                            placeholder="Jundiaí"
                            disabled={disabled}
                            {...form.register("city_name")}
                        />
                        <FormErrorMessage message={form.formState.errors.city_name?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="species_profile_id">ID da espécie</Label>
                        <Input
                            id="species_profile_id"
                            inputMode="numeric"
                            placeholder="Opcional"
                            disabled={disabled}
                            {...form.register("species_profile_id")}
                        />
                        <FormErrorMessage
                            message={form.formState.errors.species_profile_id?.message}
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="notes">Observações</Label>
                        <textarea
                            id="notes"
                            rows={5}
                            placeholder="Cadastro inicial, condição atual, histórico importante..."
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