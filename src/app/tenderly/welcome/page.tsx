"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaExternalLinkAlt,
  FaNetworkWired,
  FaEthereum,
  FaWallet,
  FaArrowRight,
  FaArrowLeft,
  FaSpinner,
  FaCheck,
} from "react-icons/fa";
import ManualSetupInstructions from "@/components/ManualSetupInstructions";
import { VIRTUAL_NET_DISPLAY_NAME } from "@/app/constants";
import { provisionVnet, getChainId } from "@/lib/tenderly";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";

const NETWORK_INFO_KEY = "tenderlyNetworkInfo";

interface NetworkInfo {
  rpcUrl: string;
  adminRpcUrl?: string;
  chainId: string;
  networkId?: string;
  name: string;
}

type SetupOption = "" | "existing" | "create";
type SetupStage = "initial" | "creating" | "complete" | "error";

const inputClass =
  "w-full rounded-lg border border-hairline bg-raised px-3 py-2.5 text-sm text-bone placeholder:text-faint focus:border-brand";
const labelClass = "mb-2 block text-sm font-medium text-bone-dim";
const helpLink =
  "mt-2 inline-flex items-center gap-1.5 text-xs text-brand transition-colors hover:text-brand-strong";

export default function WelcomePage() {
  const [setupOption, setSetupOption] = useState<SetupOption>("");
  const [endpointUrl, setEndpointUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [accountSlug, setAccountSlug] = useState("");
  const [projectSlug, setProjectSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo | null>(null);
  const [setupStage, setSetupStage] = useState<SetupStage>("initial");
  const [showManualSetup, setShowManualSetup] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(NETWORK_INFO_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as NetworkInfo;
        setNetworkInfo(parsed);
        setEndpointUrl(parsed.rpcUrl || "");
      } catch (e) {
        console.error("Failed to parse stored network info:", e);
      }
    }
  }, []);

  const save = (info: NetworkInfo) => {
    localStorage.setItem(NETWORK_INFO_KEY, JSON.stringify(info));
    setNetworkInfo(info);
    setSetupStage("complete");
  };

  const reset = () => {
    setSetupOption("");
    setEndpointUrl("");
    setApiKey("");
    setError(null);
    setShowManualSetup(false);
    setSetupStage("initial");
  };

  const useNewNetwork = () => {
    localStorage.removeItem(NETWORK_INFO_KEY);
    setNetworkInfo(null);
    reset();
  };

  // Read the vnet's real chain id from its RPC (vnets pick their own) and save.
  const finalize = async (rpcUrl: string, adminRpcUrl: string) => {
    try {
      const id = await getChainId(rpcUrl);
      save({
        rpcUrl,
        adminRpcUrl,
        chainId: `0x${id.toString(16)}`,
        name: VIRTUAL_NET_DISPLAY_NAME,
      });
    } catch {
      setError("Couldn't reach that RPC to read its chain ID. Double-check the URL.");
      setSetupStage("error");
    }
  };

  const handleExistingEndpoint = async () => {
    if (!endpointUrl.trim()) return setError("Enter your vnet's Admin RPC URL.");
    try {
      new URL(endpointUrl);
    } catch {
      return setError("That doesn't look like a valid URL.");
    }
    setError(null);
    setIsLoading(true);
    await finalize(endpointUrl.trim(), endpointUrl.trim());
    setIsLoading(false);
  };

  const handleCreateNetwork = async () => {
    if (!apiKey.trim()) return setError("Enter your Tenderly API key.");
    if (!accountSlug.trim()) return setError("Enter your account slug.");
    if (!projectSlug.trim()) return setError("Enter your project slug.");

    setIsLoading(true);
    setSetupStage("creating");
    setError(null);
    try {
      const info = await provisionVnet(apiKey.trim(), accountSlug.trim(), projectSlug.trim());
      await finalize(info.publicRpcUrl, info.adminRpcUrl ?? info.publicRpcUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create the network.");
      setSetupStage("error");
    } finally {
      setIsLoading(false);
    }
  };

  const addNetworkToWallet = async () => {
    if (!networkInfo) return;
    const eth = (window as unknown as { ethereum?: { request: (a: unknown) => Promise<unknown> } }).ethereum;
    if (!eth) return setError("No browser wallet detected. Install MetaMask to add the network.");
    try {
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: networkInfo.chainId,
            chainName: networkInfo.name || VIRTUAL_NET_DISPLAY_NAME,
            nativeCurrency: { name: "Ethereum", symbol: "ETH", decimals: 18 },
            rpcUrls: [networkInfo.rpcUrl],
          },
        ],
      });
    } catch (e) {
      console.error(e);
    }
  };

  const startChallenge = () => {
    if (!networkInfo) return setError("Set up your network first.");
    setIsNavigating(true);
    window.location.href = "/tenderly/questions/1";
  };

  const renderContent = () => {
    if (isNavigating) {
      return (
        <Card className="flex max-w-2xl items-center gap-3 p-8">
          <FaSpinner className="animate-spin text-brand" />
          <p className="text-bone-dim">Loading your challenges…</p>
        </Card>
      );
    }

    if (showManualSetup) {
      return <ManualSetupInstructions onBack={() => setShowManualSetup(false)} />;
    }

    if (networkInfo && setupStage === "initial") {
      return (
        <Card className="max-w-2xl p-8">
          <Badge tone="sign">Network saved</Badge>
          <h2 className="mt-4 font-display text-2xl font-semibold text-bone">Welcome back</h2>
          <p className="mt-2 text-bone-dim">
            We found a saved Tenderly network in this browser. Continue with it, or set up a fresh one.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={() => setSetupStage("complete")}>
              <FaNetworkWired size={13} /> Continue with saved network
            </Button>
            <Button variant="secondary" onClick={useNewNetwork}>
              Set up a new network
            </Button>
          </div>
        </Card>
      );
    }

    if (setupStage === "initial" && !setupOption) {
      return (
        <Card className="max-w-2xl p-8">
          <h2 className="font-display text-2xl font-semibold text-bone">Set up your test network</h2>
          <p className="mt-2 text-bone-dim">
            Connected-wallet mode runs on your own Tenderly virtual testnet. Pick how to connect one — your API key is used once and never stored.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              onClick={() => { setSetupOption("create"); setError(null); }}
              className="group rounded-xl border border-hairline bg-raised p-5 text-left transition-colors hover:border-brand/50"
            >
              <FaEthereum className="text-brand" size={22} />
              <h3 className="mt-3 font-display text-lg font-semibold text-bone">Create a network</h3>
              <p className="mt-1 text-sm text-bone-dim">Spin up a fresh Sepolia-forked vnet with your Tenderly API key.</p>
            </button>
            <button
              onClick={() => { setSetupOption("existing"); setError(null); }}
              className="group rounded-xl border border-hairline bg-raised p-5 text-left transition-colors hover:border-brand/50"
            >
              <FaNetworkWired className="text-brand" size={22} />
              <h3 className="mt-3 font-display text-lg font-semibold text-bone">I already have one</h3>
              <p className="mt-1 text-sm text-bone-dim">Paste the RPC endpoints of a vnet you&apos;ve already created.</p>
            </button>
          </div>
          <a href="https://docs.tenderly.co/virtual-testnets" target="_blank" rel="noopener noreferrer" className={helpLink}>
            <FaExternalLinkAlt size={11} /> Learn about Tenderly Virtual TestNets
          </a>
        </Card>
      );
    }

    if (setupStage === "initial" && setupOption === "existing") {
      return (
        <Card className="max-w-2xl p-8">
          <BackButton onClick={reset} />
          <h2 className="mt-4 font-display text-2xl font-semibold text-bone">Use an existing network</h2>
          <p className="mt-2 text-bone-dim">
            Paste your vnet&apos;s <strong className="text-bone">Admin RPC URL</strong> —
            it works for everything (your wallet and funding), and we&apos;ll read the
            chain ID from it automatically.
          </p>
          <div className="mt-6 space-y-4">
            <div>
              <label className={labelClass}>Admin RPC URL</label>
              <input type="url" value={endpointUrl} onChange={(e) => setEndpointUrl(e.target.value)} placeholder="https://virtual.sepolia.rpc.tenderly.co/…/admin" className={inputClass} />
            </div>
            {error && <p className="text-sm text-reject">{error}</p>}
          </div>
          <Button className="mt-6" onClick={handleExistingEndpoint} disabled={isLoading}>
            {isLoading ? <FaSpinner className="animate-spin" size={13} /> : null}
            Save network
          </Button>
        </Card>
      );
    }

    if (setupStage === "initial" && setupOption === "create") {
      return (
        <Card className="max-w-2xl p-8">
          <BackButton onClick={reset} />
          <h2 className="mt-4 font-display text-2xl font-semibold text-bone">Create a network</h2>
          <p className="mt-2 text-bone-dim">
            You&apos;ll need a free Tenderly account. Your API key is used only to create the network and is never saved.
          </p>

          <div className="mt-5 space-y-4">
            <div>
              <label className={labelClass}>Tenderly API key</label>
              <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Your Tenderly access key" className={inputClass} />
              <a href="https://docs.tenderly.co/account/projects/how-to-generate-api-access-token" target="_blank" rel="noopener noreferrer" className={helpLink}>
                <FaExternalLinkAlt size={11} /> How to generate an API key
              </a>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Account slug</label>
                <input type="text" value={accountSlug} onChange={(e) => setAccountSlug(e.target.value)} placeholder="your-account" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Project slug</label>
                <input type="text" value={projectSlug} onChange={(e) => setProjectSlug(e.target.value)} placeholder="project" className={inputClass} />
              </div>
            </div>
            <a href="https://docs.tenderly.co/account/projects/account-project-slug" target="_blank" rel="noopener noreferrer" className={helpLink}>
              <FaExternalLinkAlt size={11} /> Where to find your slugs
            </a>
            {error && <p className="text-sm text-reject">{error}</p>}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button onClick={handleCreateNetwork} disabled={isLoading}>
              {isLoading ? <FaSpinner className="animate-spin" size={13} /> : <FaEthereum size={13} />} Create network
            </Button>
            <button onClick={() => setShowManualSetup(true)} className="text-sm text-muted transition-colors hover:text-bone">
              Prefer to set it up manually?
            </button>
          </div>
        </Card>
      );
    }

    if (setupStage === "creating") {
      return (
        <Card className="flex max-w-2xl items-center gap-3 p-8">
          <FaSpinner className="animate-spin text-brand" />
          <p className="text-bone-dim">Forking Sepolia into a fresh Tenderly testnet…</p>
        </Card>
      );
    }

    if (setupStage === "complete" && networkInfo) {
      return (
        <Card className="max-w-2xl p-8">
          <Badge tone="sign"><FaCheck size={10} /> Ready</Badge>
          <h2 className="mt-4 font-display text-2xl font-semibold text-bone">Your network is set</h2>
          <div className="mt-5 space-y-2 rounded-xl border border-hairline bg-raised p-4">
            <Row label="Public RPC" value={networkInfo.rpcUrl} />
            <Row label="Chain ID" value={networkInfo.chainId} />
            {networkInfo.adminRpcUrl ? (
              <Row label="Funding" value="Admin RPC connected — auto-funding enabled" />
            ) : (
              <Row label="Funding" value="No admin RPC — fund your wallet manually" />
            )}
          </div>
          <div className="mt-6 flex flex-col gap-3">
            <Button onClick={startChallenge}>
              Start the challenge <FaArrowRight size={13} />
            </Button>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="secondary" onClick={addNetworkToWallet}>
                <FaWallet size={13} /> Add network to wallet
              </Button>
              <Button variant="ghost" onClick={useNewNetwork}>Set up a different network</Button>
            </div>
          </div>
        </Card>
      );
    }

    if (setupStage === "error") {
      return (
        <Card className="max-w-2xl p-8">
          <Badge tone="reject">Setup failed</Badge>
          <p className="mt-4 rounded-lg border border-reject/30 bg-reject/10 p-4 text-sm text-reject">
            {error || "An unexpected error occurred during setup."}
          </p>
          <Button variant="secondary" className="mt-6" onClick={reset}>Try again</Button>
        </Card>
      );
    }
  };

  return (
    <main className="min-h-screen bg-ink px-6 py-16">
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <div className="mb-10 text-center">
          <p className="field-label">Connected wallet</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-bone">
            Practice with your real wallet
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-bone-dim">
            Sign real transactions on a disposable test network — same wallet,
            same prompts, zero risk to real funds.
          </p>
        </div>
        {renderContent()}
      </div>
    </main>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-bone">
      <FaArrowLeft size={11} /> Back
    </button>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="field-label">{label}</span>
      <span className="break-all font-mono text-xs text-bone-dim">{value}</span>
    </div>
  );
}
