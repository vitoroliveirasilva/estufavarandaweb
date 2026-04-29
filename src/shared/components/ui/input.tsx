import * as React from "react";

import { cn } from "@/shared/utils/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type = "text", ...props }, ref) => (
        <input
            ref={ref}
            type={type}
            className={cn(
                "flex h-11 w-full rounded-2xl border border-input bg-background px-4 py-2 text-sm text-foreground shadow-sm outline-none transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground hover:border-primary/40 focus-visible:border-primary/60 focus-visible:ring-2 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-70 aria-invalid:border-destructive/60 aria-invalid:ring-2 aria-invalid:ring-destructive/15",
                className
            )}
            {...props}
        />
    )
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
