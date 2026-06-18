"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useAccount,
  useSwitchChain,
  useSendTransaction,
  useSignTypedData,
  useSignMessage,
} from "wagmi";
import type { Address } from "viem";
import {
  FaWallet,
  FaArrowRight,
  FaRedo,
  FaSpinner,
  FaInfoCircle,
} from "react-icons/fa";
import { CUSTOM_CHAIN_ID } from "@/app/constants";
import { useNetwork } from "@/components/NetworkContext";
import { fundAddress, setErc20Balance } from "@/lib/tenderly";
import { calldataDigest, eip712Digest } from "@/lib/erc8213";
import { freshSeed } from "@/lib/random";
import {
  buildRun,
  TOTAL_CHALLENGES,
  SEED_TOKENS,
  type Challenge,
  type Decision,
} from "@/data/tenderlyChallenges";
import { Card } from "@/components/ui/Card";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import FeedbackComponent from "@/components/FeedbackComponent";
import { Erc8213Note } from "@/components/Erc8213Note";
import { cn } from "@/components/ui/cn";

const RUN_KEY = "wiseTenderlyRun";

interface Result {
  decision: Decision;
  correct: boolean;
}

function isUserRejection(err: unknown): boolean {
  const e = err as { code?: number; name?: string; message?: string; shortMessage?: string; cause?: { code?: number; name?: string } };
  const code = e?.code ?? e?.cause?.code;
  const name = e?.name ?? e?.cause?.name ?? "";
  const msg = (e?.shortMessage ?? e?.message ?? "").toLowerCase();
  return (
    code === 4001 ||
    name === "UserRejectedRequestError" ||
    msg.includes("reject") ||
    msg.includes("denied") ||
    msg.includes("user cancel")
  );
}

function humanizeError(err: unknown): string {
  const e = err as { shortMessage?: string; message?: string };
  return e?.shortMessage ?? e?.message ?? "Something went wrong talking to your wallet.";
}

export default function TenderlyRunner() {
  // chainId from useAccount reflects the WALLET's actual network (useChainId
  // returns the config's chain, which hides a wrong-network wallet).
  const { address, isConnected, chainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const { sendTransactionAsync } = useSendTransaction();
  const { signTypedDataAsync } = useSignTypedData();
  const { signMessageAsync } = useSignMessage();
  const { networkInfo } = useNetwork();

  const [seed, setSeed] = useState<number | null>(null);
  const [prep, setPrep] = useState<"idle" | "funding" | "ready" | "error">("idle");
  const [prepError, setPrepError] = useState<string | null>(null);

  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Result[]>([]);
  const [revealed, setRevealed] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Use the vnet's real chain id (detected at setup), not a hardcoded one.
  const targetChainId = networkInfo?.chainId
    ? parseInt(networkInfo.chainId, 16) || CUSTOM_CHAIN_ID
    : CUSTOM_CHAIN_ID;
  const onRightChain = chainId === targetChainId;

  // Restore an in-progress run (or start a fresh one) once connected on-chain.
  useEffect(() => {
    if (!isConnected || !onRightChain || seed !== null) return;
    try {
      const stored = sessionStorage.getItem(RUN_KEY);
      if (stored) {
        const saved = JSON.parse(stored) as { seed: number; results: Result[] };
        const savedResults = saved.results ?? [];
        setSeed(saved.seed);
        setResults(savedResults);
        setIndex(savedResults.length); // resume at the next undecided challenge
        return;
      }
    } catch {
      /* ignore corrupt saved state */
    }
    setSeed(freshSeed());
  }, [isConnected, onRightChain, seed]);

  // Persist progress so a refresh resumes the same run.
  useEffect(() => {
    if (seed === null) return;
    sessionStorage.setItem(RUN_KEY, JSON.stringify({ seed, results }));
  }, [seed, results]);

  // Reflect the current level in the URL (refresh restores from storage).
  useEffect(() => {
    if (seed === null) return;
    const level = Math.min(index + 1, TOTAL_CHALLENGES);
    window.history.replaceState(null, "", `${window.location.pathname}?level=${level}`);
  }, [index, seed]);

  // Fund the player with test ETH + ERC-20 balances via the admin RPC.
  useEffect(() => {
    if (seed === null || !address || prep !== "idle") return;
    const adminRpc = networkInfo?.adminRpcUrl;
    if (!adminRpc) {
      setPrep("ready"); // no admin RPC — can't auto-fund (banner explains)
      return;
    }
    setPrep("funding");
    (async () => {
      try {
        await fundAddress(adminRpc, address);
        for (const t of SEED_TOKENS) {
          await setErc20Balance(adminRpc, t.address, address, t.amount).catch(
            () => {},
          );
        }
      } catch (e) {
        setPrepError(humanizeError(e));
      } finally {
        setPrep("ready");
      }
    })();
  }, [seed, address, networkInfo, prep]);

  const run = useMemo<Challenge[]>(
    () =>
      seed !== null && address
        ? buildRun(seed, address as Address, targetChainId)
        : [],
    [seed, address, targetChainId],
  );

  const challenge = run[index];
  const correctCount = results.filter((r) => r.correct).length;

  const erc8213 = !challenge
    ? null
    : challenge.request.kind === "tx"
      ? challenge.request.data
        ? { label: "Calldata Digest", digest: calldataDigest(challenge.request.data) }
        : null
      : challenge.request.kind === "typedData"
        ? { label: "EIP-712 Digest", digest: eip712Digest(challenge.request) }
        : null; // personal_sign has no ERC-8213 digest

  function record(decision: Decision) {
    if (!challenge) return;
    const result: Result = { decision, correct: decision === challenge.expected };
    setResults((prev) => [...prev, result]);
    setRevealed(result);
  }

  async function decideViaWallet() {
    if (!challenge) return;
    setBusy(true);
    setActionError(null);
    try {
      if (challenge.request.kind === "tx") {
        await sendTransactionAsync({
          to: challenge.request.to,
          value: challenge.request.value,
          data: challenge.request.data,
          chainId: targetChainId,
        });
      } else if (challenge.request.kind === "typedData") {
        await signTypedDataAsync({
          domain: challenge.request.domain,
          types: challenge.request.types,
          primaryType: challenge.request.primaryType,
          message: challenge.request.message,
        });
      } else {
        await signMessageAsync({ message: challenge.request.message });
      }
      record("sign");
    } catch (err) {
      if (isUserRejection(err)) record("reject");
      else setActionError(humanizeError(err));
    } finally {
      setBusy(false);
    }
  }

  function next() {
    setRevealed(null);
    setActionError(null);
    setIndex((i) => i + 1);
  }

  function newTest() {
    sessionStorage.removeItem(RUN_KEY);
    setSeed(freshSeed());
    setIndex(0);
    setResults([]);
    setRevealed(null);
    setActionError(null);
  }

  async function addNetworkToWallet() {
    const eth = (window as unknown as { ethereum?: { request: (a: unknown) => Promise<unknown> } }).ethereum;
    if (!eth || !networkInfo) return;
    try {
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: networkInfo.chainId,
            chainName: networkInfo.name,
            nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
            rpcUrls: [networkInfo.rpcUrl],
          },
        ],
      });
    } catch {
      /* user dismissed the prompt */
    }
  }

  // ---- Gates ----
  if (!isConnected) {
    return (
      <Shell>
        <Card className="mx-auto max-w-md p-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-hairline-strong bg-raised text-brand">
            <FaWallet size={20} />
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold text-bone">
            Connect your wallet
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-bone-dim">
            You&apos;ll sign or reject {TOTAL_CHALLENGES} real, escalating
            requests on a disposable test network. We&apos;ll fund you with test
            ETH — nothing here can touch real assets.
          </p>
          <div className="mt-6 flex justify-center">
            <ConnectButton chainStatus="icon" showBalance={false} />
          </div>
        </Card>
      </Shell>
    );
  }

  if (!onRightChain) {
    return (
      <Shell>
        <Card className="mx-auto max-w-md p-8 text-center">
          <h1 className="font-display text-2xl font-semibold text-bone">
            Switch to the test network
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-bone-dim">
            Your wallet is on the wrong network. Switch to the Wise Signer
            testnet to continue.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <Button onClick={() => switchChain({ chainId: targetChainId })}>
              Switch to it
            </Button>
            <Button variant="secondary" onClick={addNetworkToWallet}>
              <FaWallet size={13} /> Add network to MetaMask
            </Button>
            <Link
              href="/tenderly/welcome"
              className="text-sm text-muted transition-colors hover:text-bone"
            >
              Set up a different network
            </Link>
          </div>
        </Card>
      </Shell>
    );
  }

  if (prep !== "ready" || !challenge) {
    // Finished all challenges → summary
    if (run.length > 0 && index >= run.length) return <Summary correct={correctCount} total={run.length} onNewTest={newTest} />;
    return (
      <Shell>
        <Card className="mx-auto flex max-w-md items-center gap-3 p-8">
          <FaSpinner className="animate-spin text-brand" />
          <p className="text-sm text-bone-dim">
            {prep === "funding" ? "Funding your test wallet…" : "Preparing your challenges…"}
          </p>
        </Card>
      </Shell>
    );
  }

  // ---- Active challenge ----
  return (
    <Shell>
      <div className="mx-auto max-w-2xl">
        <ProgressDots index={index} results={results} />

        {!networkInfo?.adminRpcUrl && (
          <p className="mt-4 rounded-lg border border-caution/30 bg-caution/10 px-3 py-2 text-xs text-caution">
            No admin RPC connected, so test tokens couldn&apos;t be funded —
            transactions that need a balance may fail. Re-create your network
            from the setup page to enable auto-funding.
          </p>
        )}

        <Card className="mt-6 overflow-hidden">
          <div className="flex items-center justify-between border-b border-hairline px-5 py-3">
            <Badge tone="brand">Level {challenge.level}</Badge>
            <span className="font-mono text-xs text-muted">{challenge.origin}</span>
          </div>

          <div className="px-5 py-5">
            <h1 className="font-display text-xl font-semibold text-bone">
              {challenge.title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-bone-dim">
              {challenge.intent}
            </p>

            {challenge.note && (
              <p className="mt-3 flex items-start gap-2 rounded-lg border border-hairline bg-raised px-3 py-2 text-xs leading-relaxed text-muted">
                <FaInfoCircle className="mt-0.5 shrink-0 text-brand" size={12} />
                {challenge.note}
              </p>
            )}

            <p className="mt-6 rounded-lg border border-hairline bg-raised px-4 py-3 text-sm text-bone-dim">
              Don&apos;t take our word for it — open your wallet, read the real
              request, and check every field against what you intended above.
            </p>
          </div>

          {!revealed ? (
            <div className="border-t border-hairline p-4">
              {actionError && (
                <p className="mb-3 rounded-lg border border-reject/30 bg-reject/10 px-3 py-2 text-xs text-reject">
                  {actionError}
                </p>
              )}
              <Button
                variant="primary"
                onClick={decideViaWallet}
                disabled={busy}
                className="w-full"
              >
                {busy ? <FaSpinner className="animate-spin" size={13} /> : <FaWallet size={13} />}
                Open the request in your wallet
              </Button>
              <p className="mt-3 text-center text-xs text-muted">
                Read the real transaction, then <strong className="text-bone-dim">approve or
                reject it in your wallet</strong> — that&apos;s your answer.
              </p>
            </div>
          ) : (
            <div className="border-t border-hairline p-4">
              <p className="field-label mb-2">What the request contained</p>
              <div className="mb-4 divide-y divide-hairline/70 rounded-xl border border-hairline">
                {challenge.fields.map((f, i) => (
                  <div
                    key={i}
                    className={cn(
                      "px-4 py-2.5",
                      f.block
                        ? "flex flex-col gap-1"
                        : "flex items-center justify-between gap-4",
                    )}
                  >
                    <span className="field-label">{f.label}</span>
                    <span
                      className={cn(
                        "font-mono text-bone",
                        f.block ? "break-all text-xs" : "text-sm",
                      )}
                    >
                      {f.value}
                    </span>
                  </div>
                ))}
              </div>
              <FeedbackComponent
                isCorrect={revealed.correct}
                feedbackContent={{ pages: [verdictLine(revealed, challenge) + challenge.why] }}
              />
              {erc8213 && (
                <Erc8213Note label={erc8213.label} digest={erc8213.digest} />
              )}
              <div className="mt-4 flex justify-end">
                <Button onClick={next}>
                  {index + 1 >= run.length ? "See results" : "Next"}{" "}
                  <FaArrowRight size={12} />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </Shell>
  );
}

function verdictLine(r: Result, c: Challenge): string {
  const did = r.decision === "sign" ? "signed" : "rejected";
  const should = c.expected === "sign" ? "sign" : "reject";
  if (r.correct) return `You **${did}** it — correct.\n\n`;
  return `You **${did}** it, but the right call was to **${should}**.\n\n`;
}

function Shell({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-ink px-6 py-12">{children}</main>;
}

function ProgressDots({ index, results }: { index: number; results: Result[] }) {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-2 flex items-end justify-between">
        <span className="field-label">
          Level <span className="text-bone">{String(index + 1).padStart(2, "0")}</span> /{" "}
          {TOTAL_CHALLENGES}
        </span>
        <span className="field-label">
          <span className="text-sign">{results.filter((r) => r.correct).length}</span> correct
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: TOTAL_CHALLENGES }).map((_, i) => {
          const r = results[i];
          return (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                r ? (r.correct ? "bg-sign" : "bg-reject") : i === index ? "bg-brand" : "bg-hairline",
              )}
            />
          );
        })}
      </div>
    </div>
  );
}

function Summary({ correct, total, onNewTest }: { correct: number; total: number; onNewTest: () => void }) {
  const pct = total ? (correct / total) * 100 : 0;
  const tier =
    pct >= 100 ? "Flawless" : pct >= 70 ? "Sharp eye" : pct >= 50 ? "Getting there" : "Worth another run";
  return (
    <Shell>
      <div className="mx-auto max-w-md overflow-hidden rounded-2xl border border-hairline bg-surface text-center">
        <div className="px-8 pt-8">
          <Image src="/wise-signer.png" alt="" width={80} height={80} className="mx-auto" />
          <Badge tone="brand" className="mt-4">Connected run complete</Badge>
        </div>
        <div className="px-8 py-8">
          <p className="font-mono text-5xl font-semibold text-bone">
            {correct}
            <span className="text-muted">/{total}</span>
          </p>
          <h2 className="mt-5 font-display text-2xl font-semibold text-bone">{tier}</h2>
          <p className="mt-2 text-sm text-bone-dim">
            Each run is randomized — the safe and malicious requests shuffle, so
            you can&apos;t coast on memory.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button onClick={onNewTest}>
              <FaRedo size={13} /> New randomized run
            </Button>
            <Link href="/" className={buttonVariants({ variant: "secondary" })}>
              Home
            </Link>
          </div>
        </div>
      </div>
    </Shell>
  );
}
