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
          className={cn("pr-12", className)}
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
          className="absolute right-0 top-0 h-10 w-10 rounded-l-none text-muted-foreground hover:text-foreground"
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
