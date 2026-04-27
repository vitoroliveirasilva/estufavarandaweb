import { cn } from "@/shared/utils/cn";

export type StatusBadgeTone = "success" | "warning" | "danger" | "info" | "neutral";

type StatusBadgeProps = {
    children: React.ReactNode;
    tone?: StatusBadgeTone;
};

const toneClasses: Record<StatusBadgeTone, string> = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    danger: "border-red-200 bg-red-50 text-red-700",
    info: "border-sky-200 bg-sky-50 text-sky-700",
    neutral: "border-border bg-secondary text-secondary-foreground"
};

export function StatusBadge({ children, tone = "neutral" }: StatusBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                toneClasses[tone]
            )}
        >
            {children}
        </span>
    );
}