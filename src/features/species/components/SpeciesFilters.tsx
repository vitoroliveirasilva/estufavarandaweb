import { type FormEvent, useEffect, useMemo, useState } from "react";

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

const MAX_SEARCH_LENGTH = 120;

function normalizeSearch(value: string): string {
  return value.trim().replace(/\s+/g, " ").slice(0, MAX_SEARCH_LENGTH);
}

export function SpeciesFilters({
  value,
  isFetching = false,
  onChange,
  onClear
}: SpeciesFiltersProps) {
  const normalizedValue = useMemo(
    () => ({
      search: value.search.slice(0, MAX_SEARCH_LENGTH),
      activeOnly: value.activeOnly
    }),
    [value.activeOnly, value.search]
  );

  const [draft, setDraft] = useState<SpeciesFiltersValue>(normalizedValue);

  useEffect(() => {
    setDraft(normalizedValue);
  }, [normalizedValue]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextValue = {
      search: normalizeSearch(draft.search),
      activeOnly: draft.activeOnly
    };

    setDraft(nextValue);
    onChange(nextValue);
  }

  return (
    <Card>
      <CardContent className="p-4">
        <form
          className="grid gap-4 md:grid-cols-[1fr_auto]"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="species-search">Buscar</Label>
            <Input
              id="species-search"
              value={draft.search}
              maxLength={MAX_SEARCH_LENGTH}
              placeholder="Nome popular, científico..."
              autoComplete="off"
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  search: event.target.value.slice(0, MAX_SEARCH_LENGTH)
                }))
              }
            />
          </div>

          <div className="flex flex-col justify-end gap-3 sm:flex-row md:flex-col">
            <div className="flex h-10 items-center gap-2 rounded-xl border px-3 text-sm">
              <input
                id="species-active-only"
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
              <Label
                htmlFor="species-active-only"
                className="cursor-pointer text-sm font-normal"
              >
                Apenas ativas
              </Label>
            </div>

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
