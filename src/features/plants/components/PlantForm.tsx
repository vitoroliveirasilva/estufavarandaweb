import { zodResolver } from "@hookform/resolvers/zod";
import {
    ChevronDown,
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
import { useEffect, useRef, useState, type ReactNode } from "react";
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

type CustomSelectProps = {
    id: string;
    value?: string;
    options: readonly SelectOption[];
    disabled?: boolean;
    icon: ReactNode;
    onChange: (value: string) => void;
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

function SectionIcon({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-transparent text-primary">
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

function CustomSelect({
    id,
    value,
    options,
    disabled = false,
    icon,
    onChange
}: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const normalizedValue = value?.trim() ?? "";
    const selectedOption =
        options.find((option) => option.value === normalizedValue) ?? options[0];

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    function handleToggle() {
        if (disabled) {
            return;
        }

        setIsOpen((current) => !current);
    }

    function handleSelect(nextValue: string) {
        onChange(nextValue);
        setIsOpen(false);
    }

    return (
        <div ref={wrapperRef} className="relative">
            <FieldShell>
                <FieldIcon>{icon}</FieldIcon>

                <button
                    id={id}
                    type="button"
                    disabled={disabled}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    className="flex h-full min-w-0 flex-1 items-center justify-between gap-3 border-0 bg-transparent py-0 pl-0 pr-8 text-left text-sm text-foreground outline-none disabled:cursor-not-allowed disabled:opacity-70"
                    onClick={handleToggle}
                    onKeyDown={(event) => {
                        if (event.key === "Escape") {
                            setIsOpen(false);
                        }

                        if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            handleToggle();
                        }
                    }}
                >
                    <span className="min-w-0 truncate">
                        {selectedOption?.label ?? "Não informar"}
                    </span>
                </button>

                <ChevronDown
                    className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition ${isOpen ? "rotate-180 text-primary" : ""
                        }`}
                />
            </FieldShell>

            {isOpen ? (
                <div
                    role="listbox"
                    aria-labelledby={id}
                    className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-border/80 bg-popover p-1 text-popover-foreground shadow-xl"
                >
                    {options.map((option) => {
                        const isSelected = option.value === normalizedValue;

                        return (
                            <button
                                key={option.value || "empty"}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                className={`flex w-full items-center rounded-md px-4 py-2.5 text-left text-sm transition-colors ${isSelected
                                    ? "bg-muted/60 font-medium text-primary"
                                    : "text-foreground hover:bg-muted/40 hover:text-primary"
                                    }`}
                                onClick={() => handleSelect(option.value)}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            ) : null}
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

    function updateFormValue(field: keyof PlantFormValues, value: string) {
        form.setValue(field, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        });
    }

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

                        <FormErrorMessage
                            message={form.formState.errors.name?.message}
                        />
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

                        <FormErrorMessage
                            message={form.formState.errors.nickname?.message}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className={labelClassName} htmlFor="health_status">
                            Status de saúde
                        </Label>

                        <input type="hidden" {...form.register("health_status")} />

                        <CustomSelect
                            id="health_status"
                            disabled={disabled}
                            value={currentHealthStatus}
                            icon={<HeartPulse className="h-4 w-4" />}
                            options={getSelectOptions(
                                healthStatusOptions,
                                currentHealthStatus
                            )}
                            onChange={(value) =>
                                updateFormValue("health_status", value)
                            }
                        />

                        <FormErrorMessage
                            message={form.formState.errors.health_status?.message}
                        />
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

                        <input type="hidden" {...form.register("environment")} />

                        <CustomSelect
                            id="environment"
                            disabled={disabled}
                            value={currentEnvironment}
                            icon={<MapPin className="h-4 w-4" />}
                            options={getSelectOptions(
                                environmentOptions,
                                currentEnvironment
                            )}
                            onChange={(value) =>
                                updateFormValue("environment", value)
                            }
                        />

                        <FormErrorMessage
                            message={form.formState.errors.environment?.message}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className={labelClassName} htmlFor="light_exposure">
                            Exposição de luz
                        </Label>

                        <input type="hidden" {...form.register("light_exposure")} />

                        <CustomSelect
                            id="light_exposure"
                            disabled={disabled}
                            value={currentLightExposure}
                            icon={<SunMedium className="h-4 w-4" />}
                            options={getSelectOptions(
                                lightExposureOptions,
                                currentLightExposure
                            )}
                            onChange={(value) =>
                                updateFormValue("light_exposure", value)
                            }
                        />

                        <FormErrorMessage
                            message={form.formState.errors.light_exposure?.message}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className={labelClassName} htmlFor="ventilation">
                            Ventilação
                        </Label>

                        <input type="hidden" {...form.register("ventilation")} />

                        <CustomSelect
                            id="ventilation"
                            disabled={disabled}
                            value={currentVentilation}
                            icon={<Wind className="h-4 w-4" />}
                            options={getSelectOptions(
                                ventilationOptions,
                                currentVentilation
                            )}
                            onChange={(value) =>
                                updateFormValue("ventilation", value)
                            }
                        />

                        <FormErrorMessage
                            message={form.formState.errors.ventilation?.message}
                        />
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

                        <FormErrorMessage
                            message={form.formState.errors.location_label?.message}
                        />
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

                        <FormErrorMessage
                            message={form.formState.errors.city_name?.message}
                        />
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

                    <FormErrorMessage
                        message={form.formState.errors.notes?.message}
                    />
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
