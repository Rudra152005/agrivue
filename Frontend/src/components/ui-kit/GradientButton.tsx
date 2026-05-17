import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "outline";

export function GradientButton({
  children, variant = "primary", className = "", ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode }) {
  const base = "inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all";
  const styles: Record<Variant, string> = {
    primary: "bg-gradient-primary text-primary-foreground glow-hover hover:scale-[1.02]",
    outline: "border border-primary/40 text-foreground hover:bg-primary/10",
    ghost: "text-foreground hover:bg-accent/40",
  };
  return (
    <button {...props} className={`${base} ${styles[variant]} ${className}`}>{children}</button>
  );
}
