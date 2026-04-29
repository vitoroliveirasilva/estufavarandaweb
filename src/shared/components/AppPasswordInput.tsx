import {
  forwardRef,
  useId,
  useState,
  type MouseEventHandler
} from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input, type InputProps } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/cn";

type AppPasswordInputProps = Omit<InputProps, "type">;

const AppPasswordInput = forwardRef<HTMLInputElement, AppPasswordInputProps>(
  ({ id, className, disabled, autoComplete, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [visible, setVisible] = useState(false);

    const handleMouseDown: MouseEventHandler<HTMLButtonElement> = (event) => {
      event.preventDefault();
    };

    return (
      <div className="relative">
        <Input
          ref={ref}
          id={inputId}
          type={visible ? "text" : "password"}
          disabled={disabled}
          autoComplete={autoComplete ?? "current-password"}
          className={cn(
            "h-11 rounded-2xl border-input bg-background pr-12 shadow-sm transition-colors hover:border-primary/40 focus-visible:ring-primary/15",
            className
          )}
          {...props}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={disabled}
          aria-controls={inputId}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          aria-pressed={visible}
          className="absolute right-1 top-1/2 h-9 w-9 -translate-y-1/2 rounded-xl text-muted-foreground hover:bg-primary/5 hover:text-primary"
          onMouseDown={handleMouseDown}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="h-4 w-4" />
          ) : (
            <Eye aria-hidden="true" className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }
);

AppPasswordInput.displayName = "AppPasswordInput";

export { AppPasswordInput };
