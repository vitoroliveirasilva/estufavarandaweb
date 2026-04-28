import { ChevronDown, Search } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";

export type PlantFiltersValue = {
    search: string;
    healthStatus: string;
};

type PlantFiltersProps = {
    value: PlantFiltersValue;
    isFetching?: boolean;
    onChange: (value: PlantFiltersValue) => void;
    onClear: () => void;
};

const healthStatusOptions = [
    { value: "", label: "Todos" },
    { value: "healthy", label: "Saudável" },
    { value: "attention", label: "Atenção" },
    { value: "recovering", label: "Em recuperação" },
    { value: "critical", label: "Crítica" }
] as const;

const labelClassName = "text-sm font-medium text-foreground";

const fieldShellClassName =
    "group flex h-11 w-full items-center rounded-2xl border border-input bg-background shadow-sm transition-colors hover:border-primary/40 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15";

const inputClassName =
    "h-full min-w-0 flex-1 border-0 bg-transparent px-3 py-0 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-70";

const selectClassName =
    "h-full min-w-0 flex-1 appearance-none border-0 bg-transparent py-0 pl-3 pr-10 text-sm text-foreground outline-none disabled:cursor-not-allowed disabled:opacity-70";

function normalizeFilters(filters: PlantFiltersValue): PlantFiltersValue {
    return {
        search: filters.search.trim(),
        healthStatus: filters.healthStatus.trim()
    };
}

export function PlantFilters({
    value,
    isFetching = false,
    onChange,
    onClear
}: PlantFiltersProps) {
    const [draft, setDraft] = useState(value);

    useEffect(() => {
        setDraft(value);
    }, [value]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onChange(normalizeFilters(draft));
    }

    function handleClear() {
        setDraft({ search: "", healthStatus: "" });
        onClear();
    }

    return (
        <Card className="border-border/70 bg-card shadow-sm">
            <CardContent className="p-4">
                <form
                    className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_auto] lg:items-end"
                    onSubmit={handleSubmit}
                >
                    <div className="space-y-2">
                        <Label className={labelClassName} htmlFor="plant-search">
                            Buscar
                        </Label>

                        <div className={fieldShellClassName}>
                            <Search className="ml-3 mr-2 h-4 w-4 shrink-0 text-muted-foreground transition-colors group-focus-within:text-primary" />

                            <input
                                id="plant-search"
                                type="search"
                                value={draft.search}
                                placeholder="Nome, apelido, local..."
                                maxLength={120}
                                disabled={isFetching}
                                className={inputClassName}
                                onChange={(event) =>
                                    setDraft((current) => ({
                                        ...current,
                                        search: event.target.value
                                    }))
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className={labelClassName} htmlFor="health-status">
                            Status
                        </Label>

                        <div className={`${fieldShellClassName} relative`}>
                            <select
                                id="health-status"
                                value={draft.healthStatus}
                                disabled={isFetching}
                                className={selectClassName}
                                onChange={(event) =>
                                    setDraft((current) => ({
                                        ...current,
                                        healthStatus: event.target.value
                                    }))
                                }
                            >
                                {healthStatusOptions.map((option) => (
                                    <option
                                        key={option.value || "all"}
                                        value={option.value}
                                        className="px-3 py-2"
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="submit"
                            disabled={isFetching}
                            className="h-11 rounded-2xl px-5"
                        >
                            Filtrar
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            disabled={isFetching}
                            onClick={handleClear}
                            className="h-11 rounded-2xl px-5"
                        >
                            Limpar
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
