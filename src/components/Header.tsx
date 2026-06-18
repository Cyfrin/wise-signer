"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { FaChevronDown, FaShieldAlt, FaCode } from "react-icons/fa";
import { useNetwork } from "@/components/NetworkContext";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";

const ConnectButton = dynamic(
  () => import("@rainbow-me/rainbowkit").then((mod) => mod.ConnectButton),
  { ssr: false },
);

const navLink =
  "rounded-md px-3 py-2 text-sm text-bone-dim transition-colors hover:text-bone";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const { networkInfo } = useNetwork();
  const isTenderlyQuestionsPage =
    pathname?.startsWith("/tenderly/questions") ?? false;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const showConnectButton = mounted && isTenderlyQuestionsPage && !!networkInfo;

  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-ink/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/cyfrin.svg" alt="" width={28} height={32} priority />
          <span className="font-display text-lg font-semibold tracking-tight text-bone">
            Wise Signer
          </span>
        </Link>

        <div className="flex items-center gap-1">
          <Link href="/verify-interactions" className={cn(navLink, "hidden sm:block")}>
            Guide
          </Link>
          <Link href="/tools" className={navLink}>
            Tools
          </Link>

          {showConnectButton && (
            <div className="ml-1">
              <ConnectButton
                showBalance={false}
                chainStatus="icon"
                accountStatus={{ smallScreen: "avatar", largeScreen: "full" }}
              />
            </div>
          )}

          <div ref={menuRef} className="relative ml-1.5">
            <button
              onClick={() => setOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={open}
              className={cn(buttonVariants({ variant: "primary", size: "sm" }), "gap-1.5")}
            >
              Play
              <FaChevronDown
                size={10}
                className={cn("transition-transform", open && "rotate-180")}
              />
            </button>

            {open && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-64 overflow-hidden rounded-xl border border-hairline bg-surface shadow-2xl shadow-black/50"
              >
                <Link
                  role="menuitem"
                  href="/simulated/questions/1"
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-raised"
                >
                  <span className="mt-0.5 text-sign">
                    <FaShieldAlt size={15} />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-bone">
                      Simulated wallet
                    </span>
                    <span className="block text-xs text-muted">
                      15 scenarios · no wallet needed
                    </span>
                  </span>
                </Link>
                <div className="border-t border-hairline" />
                <Link
                  role="menuitem"
                  href="/tenderly/welcome"
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-raised"
                >
                  <span className="mt-0.5 text-brand">
                    <FaCode size={15} />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-bone">
                      Connected wallet
                    </span>
                    <span className="block text-xs text-muted">
                      Real wallet · Tenderly testnet
                    </span>
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
