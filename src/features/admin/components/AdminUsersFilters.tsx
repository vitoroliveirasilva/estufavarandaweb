import { type FormEvent, useEffect, useState } from "react";

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
        onChange(draft);
    }

    return (
        <Card>
            <CardContent className="p-4">
                <form className="flex flex-col gap-4 sm:flex-row sm:items-end" onSubmit={handleSubmit}>
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="admin-user-search">Buscar usuário</Label>
                        <Input
                            id="admin-user-search"
                            value={draft}
                            placeholder="Nome ou e-mail"
                            onChange={(event) => setDraft(event.target.value)}
                        />
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
                </form>
            </CardContent>
        </Card>
    );
}