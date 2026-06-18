import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/components/ui/cn";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "sign"
  | "reject"
  | "signOutline"
  | "rejectOutline";

export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap select-none";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand-deep text-white hover:bg-brand-strong",
  secondary:
    "border border-hairline-strong bg-surface text-bone hover:bg-raised hover:border-faint",
  ghost: "text-bone-dim hover:text-bone hover:bg-surface",
  sign: "bg-sign-strong text-ink font-semibold hover:bg-sign",
  reject: "bg-reject-strong text-white font-semibold hover:bg-reject",
  signOutline: "border border-sign/40 text-sign hover:bg-sign/10",
  rejectOutline: "border border-reject/40 text-reject hover:bg-reject/10",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-[0.95rem]",
  lg: "px-7 py-3.5 text-base",
};

export function buttonVariants({
  variant = "primary",
  size = "md",
}: { variant?: ButtonVariant; size?: ButtonSize } = {}): string {
  return cn(base, variants[variant], sizes[size]);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";
