import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GlowCardProps {
  className?: string;
  children: ReactNode;
}

export function GlowCard({ className, children }: GlowCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl glass p-6 transition-all duration-300",
        "hover:border-primary/40 hover:-translate-y-0.5",
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl",
        "before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100",
        "before:bg-[radial-gradient(400px_circle_at_var(--mx,50%)_var(--my,50%),oklch(0.62_0.22_295/0.18),transparent_60%)]",
        className,
      )}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
    >
      {children}
    </div>
  );
}
