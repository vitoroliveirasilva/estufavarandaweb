import type { HTMLAttributes } from "react";

import { cn } from "@/shared/utils/cn";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

function Skeleton({ className, ...props }: SkeletonProps) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-xl bg-muted", className)} {...props} />;
}

export { Skeleton };
export type { SkeletonProps };
