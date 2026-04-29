import { type FormEvent, useEffect, useState } from "react";
import { Loader2, Search, X } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

type AdminUsersFiltersProps = {
    value: string;
    isFetching?: boolean;
    onChange: (search: string) => void;
    onClear: () => void;
};

function normalizeSearch(value: string): string {
    return value.trim().replace(/\s+/g, " ");
}

export function AdminUsersFilters({
    value,
    isFetching = false,
    onChange,
    onClear
}: AdminUsersFiltersProps) {
    const [draft, setDraft] = useState(value);

    useEffect(() => {
        setDraft(value);
    }, [value]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onChange(normalizeSearch(draft));
    }

    function handleClear() {
        setDraft("");
        onClear();
    }

    return (
        <Card className="overflow-hidden border-border/70 bg-card shadow-sm">
            <CardContent className="p-4">
                <form
                    className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
                    onSubmit={handleSubmit}
                >
                    <div className="space-y-2">
                        <Label htmlFor="admin-user-search">Buscar usuário</Label>

                        <div className="relative">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                id="admin-user-search"
                                value={draft}
                                placeholder="Digite nome ou e-mail"
                                maxLength={120}
                                autoComplete="off"
                                disabled={isFetching}
                                className="pl-11"
                                onChange={(event) => setDraft(event.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Button
                            type="submit"
                            disabled={isFetching}
                            className="h-11 rounded-2xl px-5"
                        >
                            {isFetching ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Filtrando
                                </>
                            ) : (
                                <>
                                    <Search className="mr-2 h-4 w-4" />
                                    Filtrar
                                </>
                            )}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            disabled={isFetching && !draft}
                            className="h-11 rounded-2xl px-5"
                            onClick={handleClear}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Limpar
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
