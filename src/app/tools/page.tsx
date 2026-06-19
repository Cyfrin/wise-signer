import Link from "next/link";
import { FaArrowUpRightFromSquare, FaArrowRight } from "react-icons/fa6";

interface ToolCategory {
  title: string;
  tools: Array<{ name: string; url: string; description?: string }>;
}

const toolCategories: ToolCategory[] = [
  {
    title: "Calldata decoders",
    tools: [
      { name: "Swiss Knife Decoder", url: "https://calldata.swiss-knife.xyz/decoder", description: "Decode Ethereum transaction calldata into readable functions and params." },
      { name: "Deth Calldata Decoder", url: "https://tools.deth.net/calldata-decoder", description: "Ethereum calldata decoder by Deth." },
      { name: "quickcast.dev", url: "https://quickcast.dev/cast-calldata-decode", description: "Like Foundry's cast, but online." },
      { name: "Foundry Book", url: "https://book.getfoundry.sh/", description: "Documentation for Foundry, including calldata tooling." },
    ],
  },
  {
    title: "Safe{Wallet} TX verifiers",
    tools: [
      { name: "Cyfrin Safe Hash", url: "https://github.com/Cyfrin/safe-hash-rs", description: "Rust implementation for Safe transaction hash verification." },
      { name: "Chain Tools", url: "https://tools.cyfrin.io/safe-hash", description: "Online tool for Safe transaction hash verification." },
      { name: "Safe TX Hashes Util", url: "https://github.com/pcaversaccio/safe-tx-hashes-util", description: "Utility for Safe transaction hash verification." },
      { name: "OpenZeppelin Safe Utils", url: "https://safeutils.openzeppelin.com/", description: "Safe verification utilities from OpenZeppelin." },
    ],
  },
  {
    title: "Education & video",
    tools: [
      { name: "Verify Multi-Sig Signatures", url: "https://updraft.cyfrin.io/career-tracks/web3-wallet-security", description: "Learn how to verify multi-signature wallet signatures." },
    ],
  },
  {
    title: "Exploits & case studies",
    tools: [
      { name: "Bybit Hack", url: "https://www.ic3.gov/PSA/2025/PSA250226", description: "IC3 public service announcement on the Bybit hack." },
      { name: "Address Poisoning", url: "https://trezor.io/support/a/address-poisoning-attacks", description: "How address poisoning attacks work, from Trezor." },
      { name: "Compound Finance Website Hack", url: "https://cryptoslate.com/compound-finance-confirms-website-hack-redirecting-users-to-phishing-site/", description: "Case study on the Compound Finance front-end hijack." },
      { name: "Security Fatigue", url: "https://www.nist.gov/news-events/news/2016/10/security-fatigue-can-cause-computer-users-feel-hopeless-and-act-recklessly", description: "NIST on security fatigue and reckless behavior." },
      { name: "Password Manager Keys Leak", url: "https://blog.lastpass.com/posts/notice-of-recent-security-incident", description: "The LastPass incident where private keys leaked and funds were stolen." },
    ],
  },
  {
    title: "Security guides",
    tools: [
      { name: "How to verify all wallet interactions", url: "/verify-interactions", description: "A complete guide to verifying transactions and signatures, including EIP-7702. Essential reading." },
    ],
  },
  {
    title: "Certifications",
    tools: [
      { name: "Qualified Web3 Signer", url: "https://updraft.cyfrin.io/certifications/qualified-web3-signer", description: "Certification for Web3 transaction signing best practices and security." },
    ],
  },
];

function domainLabel(url: string): string {
  if (url.startsWith("/")) return "Wise Signer guide";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function ToolsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-16">
      <header className="max-w-2xl">
        <p className="field-label">Reference</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-bone">
          Tools &amp; resources
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-bone-dim">
          The decoders, verifiers, and references that let you read a transaction
          for yourself — instead of trusting what a website tells you it does.
        </p>
      </header>

      <div className="mt-14 space-y-14">
        {toolCategories.map((category) => (
          <section key={category.title}>
            <h2 className="border-b border-hairline pb-3 font-display text-xl font-semibold text-bone">
              {category.title}
            </h2>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {category.tools.map((tool) => {
                const internal = tool.url.startsWith("/");
                return (
                  <Link
                    key={tool.name}
                    href={tool.url}
                    target={internal ? "_self" : "_blank"}
                    rel={internal ? undefined : "noopener noreferrer"}
                    className="group flex flex-col rounded-xl border border-hairline bg-surface p-5 transition-colors hover:border-brand/50 hover:bg-raised"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-display text-base font-semibold text-bone transition-colors group-hover:text-brand">
                        {tool.name}
                      </h3>
                      <span className="mt-1 shrink-0 text-faint transition-colors group-hover:text-brand">
                        {internal ? (
                          <FaArrowRight size={13} />
                        ) : (
                          <FaArrowUpRightFromSquare size={12} />
                        )}
                      </span>
                    </div>
                    {tool.description && (
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-bone-dim">
                        {tool.description}
                      </p>
                    )}
                    <p className="mt-4 truncate font-mono text-xs text-muted">
                      {domainLabel(tool.url)}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
