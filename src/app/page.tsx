import Link from "next/link";
import Image from "next/image";
import {
  FaArrowRight,
  FaInfinity,
  FaClone,
  FaCode,
  FaEyeSlash,
  FaGlobe,
  FaShieldAlt,
  FaCheck,
} from "react-icons/fa";
import HeroSigningDemo from "@/components/landing/HeroSigningDemo";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { buttonVariants } from "@/components/ui/Button";

const threats = [
  {
    icon: FaInfinity,
    title: "Approval phishing",
    body: "Spot the unlimited token allowance hiding inside a routine-looking transaction.",
  },
  {
    icon: FaClone,
    title: "Address poisoning",
    body: "Catch the look-alike address that matches the first and last four characters — and nothing else.",
  },
  {
    icon: FaCode,
    title: "Malicious calldata",
    body: "Read what a transaction actually calls, not what the website claims it does.",
  },
  {
    icon: FaEyeSlash,
    title: "Blind signing",
    body: "Refuse the opaque EIP-712 message a hardware wallet can't show you in full.",
  },
  {
    icon: FaGlobe,
    title: "Look-alike origins",
    body: "Notice when a sign-in request comes from a domain that isn't the one you're on.",
  },
  {
    icon: FaShieldAlt,
    title: "Multisig & hardware traps",
    body: "Verify Safe transactions and Trezor screens field by field before you confirm.",
  },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      {/* Ambient glow behind the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[640px]"
        style={{
          background:
            "radial-gradient(60% 60% at 70% 0%, rgba(76,141,255,0.10) 0%, rgba(76,141,255,0) 70%)",
        }}
      />

      {/* HERO */}
      <section className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 pt-16 pb-20 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24">
        <div>
          <Badge tone="brand">Wallet security training · by Cyfrin</Badge>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.04] tracking-tight text-bone sm:text-6xl">
            Read before
            <br />
            you sign.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-bone-dim">
            Almost every drained wallet started with one approval nobody read.
            Wise Signer trains the habit that stops it — verifying a transaction
            before you approve, against realistic phishing that can&apos;t touch
            your funds.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/simulated/questions/1"
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              Start training <FaArrowRight size={14} />
            </Link>
            <Link
              href="/verify-interactions"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              How to verify a transaction
            </Link>
          </div>
          <a
            href="https://snaps.metamask.io/snap/npm/wise-signer-snap/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-bone"
          >
            Or install the MetaMask Snap to train inside your wallet
            <FaArrowRight size={11} />
          </a>
        </div>

        <div>
          <p className="field-label mb-3 ml-1">You almost approved this</p>
          <HeroSigningDemo />
          <p className="mt-3 ml-1 text-sm text-muted">
            Would you have caught it? Reject it, or hold to sign and see.
          </p>
        </div>
      </section>

      {/* MODES */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between gap-4">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-bone sm:text-3xl">
            Two ways to train
          </h2>
          <span className="field-label hidden sm:block">Pick a mode</span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card className="group flex flex-col p-7 transition-colors hover:border-hairline-strong">
            <div className="mb-5 flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-sign/30 bg-sign/10 text-sign">
                <FaShieldAlt size={18} />
              </span>
              <Badge tone="sign">Available now</Badge>
            </div>
            <h3 className="font-display text-xl font-semibold text-bone">
              Simulated wallet
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-bone-dim">
              Make sign-or-reject decisions against simulated MetaMask, Trezor,
              and Safe popups. No wallet, no network, no risk — just the reading
              practice, fifteen scenarios deep.
            </p>
            <Link
              href="/simulated/questions/1"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand transition-colors hover:text-brand-strong"
            >
              Play simulated mode <FaArrowRight size={12} />
            </Link>
          </Card>

          <Card className="flex flex-col p-7">
            <div className="mb-5 flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-hairline-strong bg-raised text-muted">
                <FaCode size={18} />
              </span>
              <Badge tone="caution">Coming soon</Badge>
            </div>
            <h3 className="font-display text-xl font-semibold text-bone">
              Connected wallet
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-bone-dim">
              Connect your real wallet to a disposable test network and sign
              real, escalating transactions that can&apos;t cost you anything.
              Randomized each run, so you can&apos;t coast on muscle memory.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-faint">
              In the workshop
            </span>
          </Card>
        </div>
      </section>

      {/* CURRICULUM */}
      <section className="mx-auto w-full max-w-6xl px-6 py-16">
        <h2 className="font-display text-2xl font-semibold tracking-tight text-bone sm:text-3xl">
          What you&apos;ll learn to catch
        </h2>
        <p className="mt-3 max-w-2xl text-bone-dim">
          The same handful of tricks drain wallet after wallet. Train your eye
          on each one until spotting it is reflex.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
          {threats.map(({ icon: Icon, title, body }) => (
            <div key={title} className="bg-surface p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-hairline-strong bg-raised text-brand">
                <Icon size={16} />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-bone">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-bone-dim">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CLOSING */}
      <section className="mx-auto w-full max-w-6xl px-6 pb-24 pt-8">
        <Card className="relative flex flex-col items-center gap-6 overflow-hidden p-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <Image
            src="/wise-signer.png"
            alt=""
            width={108}
            height={108}
            className="shrink-0"
          />
          <div className="flex-1">
            <h2 className="font-display text-2xl font-semibold tracking-tight text-bone">
              Question 01 is waiting.
            </h2>
            <p className="mt-2 text-bone-dim">
              The owl has read every transaction. Now it&apos;s your turn.
            </p>
          </div>
          <Link
            href="/simulated/questions/1"
            className={buttonVariants({ variant: "primary", size: "lg" })}
          >
            <FaCheck size={14} /> Begin
          </Link>
        </Card>
      </section>
    </main>
  );
}
