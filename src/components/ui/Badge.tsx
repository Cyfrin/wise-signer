import type { HTMLAttributes } from "react";
import { cn } from "@/components/ui/cn";

export type BadgeTone = "neutral" | "brand" | "sign" | "reject" | "caution";

const tones: Record<BadgeTone, string> = {
  neutral: "border-hairline-strong text-muted",
  brand: "border-brand/40 text-brand",
  sign: "border-sign/40 text-sign",
  reject: "border-reject/40 text-reject",
  caution: "border-caution/40 text-caution",
};

/** Small mono status pill — used for eyebrows, modes, and verdict tags. */
export function Badge({
  tone = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: BadgeTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.12em] leading-none",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
