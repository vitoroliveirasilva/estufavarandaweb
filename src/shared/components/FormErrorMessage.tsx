import { AlertCircle } from "lucide-react";
import type { HTMLAttributes } from "react";

import { cn } from "@/shared/utils/cn";

type FormErrorMessageProps = HTMLAttributes<HTMLParagraphElement> & {
  message?: string | null;
};

export function FormErrorMessage({
  message,
  className,
  ...props
}: FormErrorMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <p
      role="alert"
      aria-live="polite"
      className={cn(
        "flex items-start gap-1.5 text-sm font-medium leading-6 text-destructive",
        className
      )}
      {...props}
    >
      <AlertCircle className="mt-1 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}
