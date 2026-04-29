import { cn } from "@/shared/utils/cn";

type SectionHeaderProps = {
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeader({
  title,
  description,
  className
}: SectionHeaderProps) {
  return (
    <header className={cn("mb-4", className)}>
      <h2 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h2>

      {description ? (
        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </header>
  );
}
