import { zodResolver } from "@hookform/resolvers/zod";
import {
    CalendarDays,
    ChevronDown,
    ClipboardList,
    FileText,
    Loader2,
    Plus,
    Ruler,
    Sparkles,
    Tag,
    Type
} from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";

import { toDatetimeLocalValue } from "@/features/events/hooks/usePlantEvents";
import {
    defaultPlantEventFormValues,
    EVENT_TYPE_OPTIONS,
    plantEventSchema,
    type PlantEventFormValues
} from "@/features/events/schemas/eventSchemas";
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

const MAX_TITLE_LENGTH = 140;
const MAX_DESCRIPTION_LENGTH = 2_000;
const MAX_METADATA_FIELD_LENGTH = 180;

type EventFormProps = {
    isSubmitting?: boolean;
    apiErrorMessage?: string | null;
    onSubmit: (values: PlantEventFormValues) => Promise<void> | void;
};

type SelectOption = {
    value: string;
    label: string;
};

type EventTypeSelectProps = {
    id: string;
    value?: string;
    options: readonly SelectOption[];
    disabled?: boolean;
    icon: ReactNode;
    onChange: (value: string) => void;
};

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

function EventTypeSelect({
    id,
    value,
    options,
    disabled = false,
    icon,
    onChange
}: EventTypeSelectProps) {
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
                        {selectedOption?.label ?? "Selecione"}
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
                                key={option.value}
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
        },
        shouldFocusError: true
    });

    const disabled = isSubmitting || form.formState.isSubmitting;
    const currentEventType = form.watch("event_type");

    useEffect(() => {
        if (!form.getValues("occurred_at")) {
            form.setValue("occurred_at", toDatetimeLocalValue(), {
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
                ...defaultPlantEventFormValues,
                occurred_at: toDatetimeLocalValue()
            });
        } catch {
            // O erro fica no mutation.error e é exibido pelo apiErrorMessage.
        }
    });

    function updateFormValue(field: keyof PlantEventFormValues, value: string) {
        form.setValue(field, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        });
    }

    return (
        <Card className="overflow-visible border-border/70 bg-card shadow-sm">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <SectionIcon>
                        <ClipboardList className="h-5 w-5" />
                    </SectionIcon>

                    <div className="min-w-0 space-y-1">
                        <CardTitle className="text-lg">
                            Criar evento ou cuidado
                        </CardTitle>

                        <CardDescription className="leading-6">
                            Anote observações, regas, podas, tratamentos e todas as mudanças importantes realizadas.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <form
                    className="grid gap-5 md:grid-cols-2"
                    onSubmit={(event) => void handleSubmit(event)}
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

                    <div className="space-y-2">
                        <Label className={labelClassName} htmlFor="event_type">
                            Tipo *
                        </Label>

                        <input type="hidden" {...form.register("event_type")} />

                        <EventTypeSelect
                            id="event_type"
                            disabled={disabled}
                            value={currentEventType}
                            icon={<Tag className="h-4 w-4" />}
                            options={EVENT_TYPE_OPTIONS}
                            onChange={(value) => updateFormValue("event_type", value)}
                        />

                        <FormErrorMessage message={form.formState.errors.event_type?.message} />
                    </div>

                    <div className="space-y-2">
                        <Label className={labelClassName} htmlFor="occurred_at">
                            Data e hora *
                        </Label>

                        <FieldShell>
                            <FieldIcon>
                                <CalendarDays className="h-4 w-4" />
                            </FieldIcon>

                            <input
                                id="occurred_at"
                                type="datetime-local"
                                disabled={disabled}
                                aria-invalid={Boolean(form.formState.errors.occurred_at)}
                                className={fieldControlClassName}
                                {...form.register("occurred_at")}
                            />
                        </FieldShell>

                        <FormErrorMessage message={form.formState.errors.occurred_at?.message} />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label className={labelClassName} htmlFor="title">
                            Título *
                        </Label>

                        <FieldShell>
                            <FieldIcon>
                                <Type className="h-4 w-4" />
                            </FieldIcon>

                            <input
                                id="title"
                                type="text"
                                placeholder="Ex.: Rega após dia quente"
                                autoComplete="off"
                                maxLength={MAX_TITLE_LENGTH}
                                disabled={disabled}
                                aria-invalid={Boolean(form.formState.errors.title)}
                                className={fieldControlClassName}
                                {...form.register("title")}
                            />
                        </FieldShell>

                        <FormErrorMessage message={form.formState.errors.title?.message} />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label className={labelClassName} htmlFor="description">
                            Descrição
                        </Label>

                        <div className="relative">
                            <FileText className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-muted-foreground" />
                            <textarea
                                id="description"
                                rows={4}
                                placeholder="Folhas firmes, substrato seco, brotação nova, mudança de local..."
                                maxLength={MAX_DESCRIPTION_LENGTH}
                                disabled={disabled}
                                aria-invalid={Boolean(form.formState.errors.description)}
                                className={`${textareaClassName} pl-11`}
                                {...form.register("description")}
                            />
                        </div>

                        <FormErrorMessage message={form.formState.errors.description?.message} />
                    </div>

                    <div className="rounded-3xl border border-border/70 bg-muted/20 p-4 md:col-span-2">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-background text-primary shadow-sm">
                                <Sparkles className="h-5 w-5" />
                            </div>

                            <div className="min-w-0 space-y-1">
                                <p className="text-sm font-semibold text-foreground">
                                    Detalhes opcionais
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label className={labelClassName} htmlFor="metadata_detail">
                                    Detalhe
                                </Label>

                                <FieldShell>
                                    <FieldIcon>
                                        <FileText className="h-4 w-4" />
                                    </FieldIcon>

                                    <input
                                        id="metadata_detail"
                                        type="text"
                                        placeholder="Ex.: substrato estava seco"
                                        autoComplete="off"
                                        maxLength={MAX_METADATA_FIELD_LENGTH}
                                        disabled={disabled}
                                        aria-invalid={Boolean(form.formState.errors.metadata_detail)}
                                        className={fieldControlClassName}
                                        {...form.register("metadata_detail")}
                                    />
                                </FieldShell>

                                <FormErrorMessage
                                    message={form.formState.errors.metadata_detail?.message}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className={labelClassName} htmlFor="metadata_result">
                                    Resultado observado
                                </Label>

                                <FieldShell>
                                    <FieldIcon>
                                        <Sparkles className="h-4 w-4" />
                                    </FieldIcon>

                                    <input
                                        id="metadata_result"
                                        type="text"
                                        placeholder="Ex.: folhas recuperaram firmeza"
                                        autoComplete="off"
                                        maxLength={MAX_METADATA_FIELD_LENGTH}
                                        disabled={disabled}
                                        aria-invalid={Boolean(form.formState.errors.metadata_result)}
                                        className={fieldControlClassName}
                                        {...form.register("metadata_result")}
                                    />
                                </FieldShell>

                                <FormErrorMessage
                                    message={form.formState.errors.metadata_result?.message}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className={labelClassName} htmlFor="metadata_amount">
                                    Quantidade
                                </Label>

                                <FieldShell>
                                    <FieldIcon>
                                        <Ruler className="h-4 w-4" />
                                    </FieldIcon>

                                    <input
                                        id="metadata_amount"
                                        type="text"
                                        placeholder="Ex.: 250"
                                        autoComplete="off"
                                        maxLength={MAX_METADATA_FIELD_LENGTH}
                                        disabled={disabled}
                                        aria-invalid={Boolean(form.formState.errors.metadata_amount)}
                                        className={fieldControlClassName}
                                        {...form.register("metadata_amount")}
                                    />
                                </FieldShell>

                                <FormErrorMessage
                                    message={form.formState.errors.metadata_amount?.message}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className={labelClassName} htmlFor="metadata_unit">
                                    Unidade
                                </Label>

                                <FieldShell>
                                    <FieldIcon>
                                        <Tag className="h-4 w-4" />
                                    </FieldIcon>

                                    <input
                                        id="metadata_unit"
                                        type="text"
                                        placeholder="Ex.: ml, g, dias"
                                        autoComplete="off"
                                        maxLength={MAX_METADATA_FIELD_LENGTH}
                                        disabled={disabled}
                                        aria-invalid={Boolean(form.formState.errors.metadata_unit)}
                                        className={fieldControlClassName}
                                        {...form.register("metadata_unit")}
                                    />
                                </FieldShell>

                                <FormErrorMessage
                                    message={form.formState.errors.metadata_unit?.message}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <div className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-background p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm leading-6 text-muted-foreground">
                                Revise o tipo, a data e os detalhes antes de salvar o evento.
                            </p>

                            <Button
                                type="submit"
                                disabled={disabled}
                                className="h-11 w-full rounded-2xl px-6 text-sm font-semibold shadow-sm transition hover:shadow-md disabled:shadow-none sm:w-auto"
                            >
                                {disabled ? (
                                    <>
                                        <Loader2
                                            className="mr-2 h-4 w-4 animate-spin"
                                            aria-hidden="true"
                                        />
                                        Criando
                                    </>
                                ) : (
                                    <>
                                        <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                                        Criar evento
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
