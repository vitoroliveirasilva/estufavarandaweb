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
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {message}
    </p>
  );
}
