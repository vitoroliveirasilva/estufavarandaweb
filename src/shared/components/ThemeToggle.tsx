import { Moon, Sun } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { useTheme } from "@/shared/theme/useTheme";
import { cn } from "@/shared/utils/cn";

type ThemeToggleProps = {
    className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
    const { isDark, toggleTheme } = useTheme();

    const label = isDark ? "Ativar tema claro" : "Ativar tema escuro";
    const Icon = isDark ? Sun : Moon;

    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label={label}
            title={label}
            onClick={toggleTheme}
            className={cn(
                "h-10 rounded-2xl border-border/70 bg-card shadow-sm transition-colors hover:border-primary/20 hover:bg-primary/5 hover:text-primary",
                className
            )}
        >
            <Icon className="h-4 w-4 sm:mr-2" aria-hidden="true" />

            <span className="hidden sm:inline">
                {isDark ? "Claro" : "Escuro"}
            </span>
        </Button>
    );
}
