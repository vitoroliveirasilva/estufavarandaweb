import { type FormEvent, useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export type PlantFiltersValue = {
    search: string;
    healthStatus: string;
    includeArchived: boolean;
};

type PlantFiltersProps = {
    value: PlantFiltersValue;
    isFetching?: boolean;
    onChange: (value: PlantFiltersValue) => void;
    onClear: () => void;
};

const healthStatusOptions = [
    {
        value: "",
        label: "Todos"
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
        onChange(draft);
    }

    return (
        <Card>
            <CardContent className="p-4">
                <form className="grid gap-4 lg:grid-cols-[1fr_220px_auto]" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="plant-search">Buscar</Label>
                        <Input
                            id="plant-search"
                            value={draft.search}
                            placeholder="Nome, apelido, local..."
                            onChange={(event) =>
                                setDraft((current) => ({
                                    ...current,
                                    search: event.target.value
                                }))
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="health-status">Status</Label>
                        <select
                            id="health-status"
                            value={draft.healthStatus}
                            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            onChange={(event) =>
                                setDraft((current) => ({
                                    ...current,
                                    healthStatus: event.target.value
                                }))
                            }
                        >
                            {healthStatusOptions.map((option) => (
                                <option key={option.value || "all"} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col justify-end gap-3 sm:flex-row lg:flex-col">
                        <label className="flex h-10 items-center gap-2 rounded-xl border px-3 text-sm">
                            <input
                                type="checkbox"
                                checked={draft.includeArchived}
                                className="h-4 w-4 rounded border-input accent-primary"
                                onChange={(event) =>
                                    setDraft((current) => ({
                                        ...current,
                                        includeArchived: event.target.checked
                                    }))
                                }
                            />
                            Incluir arquivadas
                        </label>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={isFetching}>
                                Filtrar
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={isFetching}
                                onClick={onClear}
                            >
                                Limpar
                            </Button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}