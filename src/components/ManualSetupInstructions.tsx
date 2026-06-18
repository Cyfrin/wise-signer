"use client";

import { useState } from "react";
import { FaExternalLinkAlt, FaArrowLeft, FaCopy, FaCheck } from "react-icons/fa";
import { Card } from "@/components/ui/Card";
import { Button, buttonVariants } from "@/components/ui/Button";

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <span className="field-label">{label}</span>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-md border border-hairline px-2 py-1 text-xs text-bone-dim transition-colors hover:text-bone"
        >
          {copied ? <FaCheck className="text-sign" size={10} /> : <FaCopy size={10} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="rounded-lg border border-hairline bg-ink px-3 py-2 font-mono text-sm text-bone">
        {value}
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="field-label">{label}</span>
      <div className="mt-1 rounded-lg border border-hairline bg-ink px-3 py-2 font-mono text-sm text-bone">
        {value}
      </div>
    </div>
  );
}

const ManualSetupInstructions = ({ onBack }: { onBack: () => void }) => {
  return (
    <Card className="max-w-3xl p-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-bone"
      >
        <FaArrowLeft size={11} /> Back to options
      </button>

      <h2 className="mt-4 font-display text-2xl font-semibold text-bone">
        Manual network setup
      </h2>
      <p className="mt-2 text-bone-dim">
        Create the Virtual TestNet yourself in Tenderly, then paste its RPC URLs
        back here. Use exactly these settings.
      </p>

      <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-hairline bg-raised p-5">
          <h3 className="font-display text-base font-semibold text-bone">
            1 · Create an account &amp; project
          </h3>
          <div className="mt-3 flex flex-wrap gap-4">
            <a href="https://dashboard.tenderly.co/register" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-brand hover:text-brand-strong">
              <FaExternalLinkAlt size={11} /> Create account
            </a>
            <a href="https://dashboard.tenderly.co/projects/create" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-brand hover:text-brand-strong">
              <FaExternalLinkAlt size={11} /> Create project
            </a>
          </div>
        </div>

        <div className="rounded-xl border border-hairline bg-raised p-5">
          <h3 className="font-display text-base font-semibold text-bone">
            2 · Create a Virtual TestNet with these settings
          </h3>
          <div className="mt-4 space-y-4">
            <CopyField label="Network slug" value="cyfrin-wise-signer" />
            <CopyField label="Display name" value="Wise Signer" />
            <CopyField label="Chain ID" value="356661" />
            <InfoField label="Network to fork" value="Sepolia (11155111)" />
            <InfoField label="Block number" value="latest" />
            <InfoField label="Sync state" value="Disabled" />
          </div>
        </div>

        <div className="rounded-xl border border-hairline bg-raised p-5">
          <h3 className="font-display text-base font-semibold text-bone">
            3 · Copy the RPC URLs
          </h3>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-bone-dim marker:text-faint">
            <li>Open your new Virtual TestNet and find the RPC Endpoints section.</li>
            <li>Copy the <strong className="text-bone">Public RPC</strong> URL.</li>
            <li>Copy the <strong className="text-bone">Admin RPC</strong> URL too (it enables auto-funding).</li>
            <li>Paste both into the &ldquo;I already have one&rdquo; option here.</li>
          </ol>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <Button variant="secondary" onClick={onBack}>
          Back
        </Button>
        <a
          href="https://dashboard.tenderly.co/"
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "primary" })}
        >
          <FaExternalLinkAlt size={12} /> Tenderly dashboard
        </a>
      </div>
    </Card>
  );
};

export default ManualSetupInstructions;
