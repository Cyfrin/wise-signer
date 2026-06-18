"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaLock,
  FaRedo,
  FaArrowRight,
} from "react-icons/fa";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";

type Decision = "idle" | "rejected" | "signed";
const HOLD_MS = 750;

function Field({
  label,
  value,
  sub,
  danger,
  flag,
}: {
  label: string;
  value: string;
  sub?: string;
  danger?: boolean;
  flag?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 px-5 py-3",
        danger && "bg-reject/10",
      )}
    >
      <span className="field-label pt-1">{label}</span>
      <span className="text-right">
        <span
          className={cn(
            "font-mono text-sm",
            danger ? "font-semibold text-reject" : "text-bone",
          )}
        >
          {value}
        </span>
        {sub && (
          <span className="mt-0.5 block font-mono text-[0.7rem] text-muted">
            {sub}
          </span>
        )}
        {flag && (
          <span className="mt-1 flex items-center justify-end gap-1 text-[0.7rem] text-caution">
            <FaExclamationTriangle size={10} /> {flag}
          </span>
        )}
      </span>
    </div>
  );
}

export default function HeroSigningDemo() {
  const [decision, setDecision] = useState<Decision>("idle");
  const [progress, setProgress] = useState(0);
  const raf = useRef<number | null>(null);
  const startedAt = useRef(0);

  const cancelHold = useCallback(() => {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    raf.current = null;
    setProgress((p) => (p >= 100 ? p : 0));
  }, []);

  const tick = useCallback((now: number) => {
    const pct = Math.min(100, ((now - startedAt.current) / HOLD_MS) * 100);
    setProgress(pct);
    if (pct >= 100) {
      raf.current = null;
      setDecision("signed");
      return;
    }
    raf.current = requestAnimationFrame(tick);
  }, []);

  const beginHold = useCallback(() => {
    if (decision !== "idle") return;
    startedAt.current = performance.now();
    raf.current = requestAnimationFrame(tick);
  }, [decision, tick]);

  useEffect(
    () => () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    },
    [],
  );

  const reset = () => {
    setProgress(0);
    setDecision("idle");
  };

  const verdict = decision === "rejected" ? "good" : "bad";

  return (
    <Card className="relative overflow-hidden shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between border-b border-hairline px-5 py-3">
        <span className="field-label flex items-center gap-2">
          <FaLock size={11} /> Signature request
        </span>
        <span className="font-mono text-xs text-muted">app.uniswap.org</span>
      </div>

      <div className="divide-y divide-hairline/70">
        <Field label="Network" value="Ethereum Mainnet" />
        <Field label="Token" value="0xA0b8…6eB48" sub="USD Coin (USDC)" />
        <Field label="Function" value="approve(spender, amount)" />
        <Field label="Spender" value="0x1F98…a1F2" flag="Unverified contract" />
        <Field
          label="Allowance"
          value="Unlimited"
          danger
          sub="2^256 − 1 — every USDC you hold, forever"
        />
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        <button
          onClick={() => decision === "idle" && setDecision("rejected")}
          className={cn(
            buttonVariants({ variant: "rejectOutline", size: "sm" }),
            "w-full sm:py-3 sm:text-[0.95rem]",
          )}
        >
          <FaTimes size={13} /> Reject
        </button>
        <button
          onPointerDown={beginHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setDecision("signed");
            }
          }}
          aria-label="Hold to sign"
          className={cn(
            buttonVariants({ variant: "sign", size: "sm" }),
            "relative w-full touch-none overflow-hidden sm:py-3 sm:text-[0.95rem]",
          )}
        >
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 bg-black/25"
            style={{ width: `${progress}%` }}
          />
          <span className="relative flex items-center gap-2">
            <FaCheck size={13} /> Hold to sign
          </span>
        </button>
      </div>

      {decision !== "idle" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink/92 px-6 text-center backdrop-blur-sm">
          <span
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full",
              verdict === "good"
                ? "bg-sign/15 text-sign"
                : "bg-reject/15 text-reject",
            )}
          >
            {verdict === "good" ? <FaCheck size={20} /> : <FaTimes size={20} />}
          </span>
          <p className="max-w-sm text-sm leading-relaxed text-bone-dim">
            {verdict === "good" ? (
              <>
                <span className="font-semibold text-bone">Good call.</span> That
                was approval phishing — signing would have let an unverified
                contract drain all your USDC.
              </>
            ) : (
              <>
                <span className="font-semibold text-bone">Approved.</span> An
                attacker can now move all your USDC, forever. This is exactly how
                wallets get drained.
              </>
            )}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={reset}
              className={buttonVariants({ variant: "secondary", size: "sm" })}
            >
              <FaRedo size={11} /> Try again
            </button>
            <Link
              href="/simulated/questions/1"
              className={buttonVariants({ variant: "primary", size: "sm" })}
            >
              Start training <FaArrowRight size={11} />
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
}
