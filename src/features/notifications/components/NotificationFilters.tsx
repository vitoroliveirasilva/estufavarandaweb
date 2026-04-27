import { type FormEvent, useEffect, useState } from "react";

import {
    NOTIFICATION_STATUSES,
    type NotificationStatusFilter
} from "@/features/notifications/types/notificationTypes";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Label } from "@/shared/components/ui/label";

export type NotificationFiltersValue = {
    status: NotificationStatusFilter;
};

type NotificationFiltersProps = {
    value: NotificationFiltersValue;
    isFetching?: boolean;
    onChange: (value: NotificationFiltersValue) => void;
    onClear: () => void;
};

const statusOptions: Array<{
    value: NotificationStatusFilter;
    label: string;
}> = [
        {
            value: "",
            label: "Todas"
        },
        {
            value: NOTIFICATION_STATUSES[0],
            label: "Pendentes"
        },
        {
            value: NOTIFICATION_STATUSES[1],
            label: "Lidas"
        },
        {
            value: NOTIFICATION_STATUSES[2],
            label: "Descartadas"
        }
    ];

export function NotificationFilters({
    value,
    isFetching = false,
    onChange,
    onClear
}: NotificationFiltersProps) {
    const [draft, setDraft] = useState<NotificationFiltersValue>(value);

    useEffect(() => {
        setDraft(value);
    }, [value.status]);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onChange(draft);
    }

    return (
        <Card>
            <CardContent className="p-4">
                <form
                    className="flex flex-col gap-4 sm:flex-row sm:items-end"
                    onSubmit={handleSubmit}
                >
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="notification-status">Status</Label>
                        <select
                            id="notification-status"
                            value={draft.status}
                            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={isFetching}
                            onChange={(event) =>
                                setDraft({
                                    status: event.target.value as NotificationStatusFilter
                                })
                            }
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value || "all"} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={isFetching}>
                            Filtrar
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isFetching && !value.status}
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
