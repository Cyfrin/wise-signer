import type { HTMLAttributes } from "react";
import { cn } from "@/components/ui/cn";

/** Surface card with a hairline border — the base container of the Ledger UI. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-xl border border-hairline bg-surface", className)}
      {...props}
    />
  );
}
