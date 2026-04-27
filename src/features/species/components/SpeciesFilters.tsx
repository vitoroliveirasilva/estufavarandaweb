import { type FormEvent, useEffect, useState } from "react";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export type SpeciesFiltersValue = {
    search: string;
    activeOnly: boolean;
};

type SpeciesFiltersProps = {
    value: SpeciesFiltersValue;
    isFetching?: boolean;
    onChange: (value: SpeciesFiltersValue) => void;
    onClear: () => void;
};

export function SpeciesFilters({
    value,
    isFetching = false,
    onChange,
    onClear
}: SpeciesFiltersProps) {
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
                <form className="grid gap-4 md:grid-cols-[1fr_auto]" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="species-search">Buscar</Label>
                        <Input
                            id="species-search"
                            value={draft.search}
                            placeholder="Nome popular, científico..."
                            onChange={(event) =>
                                setDraft((current) => ({
                                    ...current,
                                    search: event.target.value
                                }))
                            }
                        />
                    </div>

                    <div className="flex flex-col justify-end gap-3 sm:flex-row md:flex-col">
                        <label className="flex h-10 items-center gap-2 rounded-xl border px-3 text-sm">
                            <input
                                type="checkbox"
                                checked={draft.activeOnly}
                                className="h-4 w-4 rounded border-input accent-primary"
                                onChange={(event) =>
                                    setDraft((current) => ({
                                        ...current,
                                        activeOnly: event.target.checked
                                    }))
                                }
                            />
                            Apenas ativas
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