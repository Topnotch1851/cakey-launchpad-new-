import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionProps {
  id?: string;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}

export function Section({ id, className, containerClassName, children }: SectionProps) {
  return (
    <section id={id} className={cn("relative py-24 sm:py-32", className)}>
      <div className={cn("mx-auto w-full max-w-7xl px-6 lg:px-8", containerClassName)}>
        {children}
      </div>
    </section>
  );
}

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        align === "left" && "text-left",
        className,
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-accent backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_12px_var(--cyan)]" />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-5 text-balance font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-pretty text-base text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
