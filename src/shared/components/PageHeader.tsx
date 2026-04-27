import { type ReactNode } from "react";

type PageHeaderProps = {
    eyebrow?: string;
    title: string;
    description?: string;
    actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
                {eyebrow ? (
                    <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                        {eyebrow}
                    </p>
                ) : null}
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                        {title}
                    </h1>
                    {description ? (
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                            {description}
                        </p>
                    ) : null}
                </div>
            </div>

            {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
        </div>
    );
}