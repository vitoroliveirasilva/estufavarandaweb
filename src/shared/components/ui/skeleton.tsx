import type { HTMLAttributes } from "react";

import { cn } from "@/shared/utils/cn";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-2xl bg-muted/70",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
export type { SkeletonProps };
