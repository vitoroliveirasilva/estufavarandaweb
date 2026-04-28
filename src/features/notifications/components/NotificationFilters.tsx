import { ChevronDown } from "lucide-react";
import { type FormEvent, useEffect, useRef, useState } from "react";

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

type SelectOption = {
    value: NotificationStatusFilter;
    label: string;
};

type StatusSelectProps = {
    id: string;
    value: NotificationStatusFilter;
    options: readonly SelectOption[];
    disabled?: boolean;
    onChange: (value: NotificationStatusFilter) => void;
};

const statusOptions = [
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
] as const satisfies readonly SelectOption[];

const labelClassName = "text-sm font-medium text-foreground";

const fieldShellClassName =
    "group relative flex h-11 w-full items-center rounded-2xl border border-input bg-background shadow-sm transition-colors hover:border-primary/40 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/15";

function StatusSelect({
    id,
    value,
    options,
    disabled = false,
    onChange
}: StatusSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement | null>(null);

    const selectedOption =
        options.find((option) => option.value === value) ?? options[0];

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

    function handleSelect(nextValue: NotificationStatusFilter) {
        onChange(nextValue);
        setIsOpen(false);
    }

    return (
        <div ref={wrapperRef} className="relative">
            <div className={fieldShellClassName}>
                <button
                    id={id}
                    type="button"
                    disabled={disabled}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    className="flex h-full min-w-0 flex-1 items-center justify-between gap-3 border-0 bg-transparent py-0 pl-4 pr-10 text-left text-sm text-foreground outline-none disabled:cursor-not-allowed disabled:opacity-70"
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
                        {selectedOption?.label ?? "Todas"}
                    </span>
                </button>

                <ChevronDown
                    className={`pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition ${isOpen ? "rotate-180 text-primary" : ""
                        }`}
                    aria-hidden="true"
                />
            </div>

            {isOpen ? (
                <div
                    role="listbox"
                    aria-labelledby={id}
                    className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-2xl border border-border/80 bg-popover p-1 text-popover-foreground shadow-xl"
                >
                    {options.map((option) => {
                        const isSelected = option.value === value;

                        return (
                            <button
                                key={option.value || "all"}
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

    function handleClear() {
        setDraft({ status: "" });
        onClear();
    }

    return (
        <Card className="overflow-visible border-border/70 bg-card shadow-sm">
            <CardContent className="p-4">
                <form
                    className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
                    onSubmit={handleSubmit}
                >
                    <div className="space-y-2">
                        <Label className={labelClassName} htmlFor="notification-status">
                            Status
                        </Label>

                        <StatusSelect
                            id="notification-status"
                            value={draft.status}
                            options={statusOptions}
                            disabled={isFetching}
                            onChange={(nextStatus) => setDraft({ status: nextStatus })}
                        />
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
                            disabled={isFetching && !value.status}
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