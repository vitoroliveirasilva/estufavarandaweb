import * as React from "react";

import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input, type InputProps } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/cn";

type AppPasswordInputProps = Omit<InputProps, "type">;

const AppPasswordInput = React.forwardRef<HTMLInputElement, AppPasswordInputProps>(
    ({ className, disabled, ...props }, ref) => {
        const [visible, setVisible] = React.useState(false);

        return (
            <div className="relative">
                <Input
                    ref={ref}
                    type={visible ? "text" : "password"}
                    disabled={disabled}
                    className={cn("pr-12", className)}
                    {...props}
                />

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={disabled}
                    aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
                    className="absolute right-0 top-0 h-10 w-10 rounded-l-none text-muted-foreground hover:text-foreground"
                    onClick={() => setVisible((current) => !current)}
                >
                    {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
            </div>
        );
    }
);

AppPasswordInput.displayName = "AppPasswordInput";

export { AppPasswordInput };