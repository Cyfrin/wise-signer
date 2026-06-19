import { FaFingerprint } from "react-icons/fa";

/** Post-decision note showing the ERC-8213 digest a supporting wallet would display. */
export function Erc8213Note({ label, digest }: { label: string; digest: string }) {
  return (
    <div className="mt-4 rounded-xl border border-hairline bg-surface p-4">
      <p className="field-label mb-2 flex items-center gap-2">
        <FaFingerprint size={11} /> ERC-8213 · {label}
      </p>
      <p className="break-all font-mono text-xs text-brand">{digest}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        If your wallet supported{" "}
        <a
          href="https://erc8213.eth.limo/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline underline-offset-2 hover:text-brand-strong"
        >
          ERC-8213
        </a>
        , it would show this digest. Compute it yourself and compare — a
        compromised UI can&apos;t fake a matching digest.
      </p>
    </div>
  );
}
