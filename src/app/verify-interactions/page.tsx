"use client";

import Link from "next/link";
import React, { ReactNode, ElementType } from "react";
import {
  FaShieldAlt,
  FaExchangeAlt,
  FaFileSignature,
  FaCheckCircle,
  FaExclamationTriangle,
  FaLock,
  FaExternalLinkAlt,
  FaListAlt,
  FaInfoCircle,
  FaEye,
  FaFileCode,
  FaNetworkWired,
} from "react-icons/fa";

interface SectionCardProps {
  id: string;
  title: string;
  icon: ElementType;
  children: ReactNode;
}

// Helper component for consistent section styling
const SectionCard = ({ id, title, icon: Icon, children }: SectionCardProps) => (
  <section
    id={id}
    className="scroll-mt-24 rounded-2xl border border-hairline bg-surface p-6 sm:p-8"
  >
    <div className="mb-6 flex items-center gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-hairline-strong bg-raised text-brand">
        <Icon size={20} />
      </span>
      <h2 className="font-display text-2xl font-semibold tracking-tight text-bone sm:text-3xl">
        {title}
      </h2>
    </div>
    <div className="space-y-6 text-sm leading-relaxed text-bone-dim sm:text-base">
      {children}
    </div>
  </section>
);

interface SubSectionProps {
  title: string;
  children: ReactNode;
  icon?: ElementType;
}

// Helper component for sub-sections
const SubSection = ({ title, children, icon: Icon }: SubSectionProps) => (
  <div>
    <h3 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-bone sm:text-xl">
      {Icon && <Icon size={18} className="text-brand" />}
      {title}
    </h3>
    <div className="space-y-3 border-l-2 border-hairline pl-4 text-bone-dim">
      {children}
    </div>
  </div>
);

interface DetailListItemProps {
  children: ReactNode;
  strongPrefix?: string;
}

// Helper for general list items
const DetailListItem = ({ children, strongPrefix }: DetailListItemProps) => (
  <li className="flex items-start gap-2.5">
    <FaInfoCircle size={16} className="mt-1 shrink-0 text-brand/70" />
    <span>
      {strongPrefix && <strong className="text-bone">{strongPrefix}</strong>}
      {children}
    </span>
  </li>
);

interface CheckListItemProps {
  children: ReactNode;
}

// Helper for checklist items
const CheckListItem = ({ children }: CheckListItemProps) => (
  <li className="flex items-start gap-2.5">
    <FaCheckCircle size={16} className="mt-1 shrink-0 text-sign" />
    <span>{children}</span>
  </li>
);

interface RedFlagListItemProps {
  children: ReactNode;
}

// Helper for red flag list items
const RedFlagListItem = ({ children }: RedFlagListItemProps) => (
  <li className="flex items-start gap-2.5">
    <FaExclamationTriangle size={16} className="mt-1 shrink-0 text-reject" />
    <span>{children}</span>
  </li>
);

const VerifyInteractionsPage = () => {
  return (
    <div className="min-h-screen bg-ink">
      <div className="px-6 py-16">
        <div className="mx-auto max-w-4xl space-y-16">
          <header className="text-center">
            <div className="flex justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-hairline-strong bg-raised text-brand">
                <FaShieldAlt size={26} />
              </span>
            </div>
            <p className="field-label mt-6">The discipline</p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-bone sm:text-5xl">
              Verify every wallet interaction
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-bone-dim">
              Before you sign anything, pause and inspect it. This guide covers
              reading transactions and signatures — from routine transfers to
              EIP-7702 delegation — so you can protect your assets from phishing
              and malicious dApps.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="#transactions"
                className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-surface px-4 py-2 text-sm text-bone-dim transition-colors hover:border-hairline-strong hover:text-bone"
              >
                <FaExchangeAlt size={14} /> Transactions
              </a>
              <a
                href="#signatures"
                className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-surface px-4 py-2 text-sm text-bone-dim transition-colors hover:border-hairline-strong hover:text-bone"
              >
                <FaFileSignature size={14} /> Signatures
              </a>
              <a
                href="#clear-signing"
                className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-surface px-4 py-2 text-sm text-bone-dim transition-colors hover:border-hairline-strong hover:text-bone"
              >
                <FaEye size={14} /> Clear signing
              </a>
              <a
                href="#checklist"
                className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-surface px-4 py-2 text-sm text-bone-dim transition-colors hover:border-hairline-strong hover:text-bone"
              >
                <FaListAlt size={14} /> Checklist
              </a>
            </div>
          </header>

          {/* Section 1: Verifying Transactions */}
          <SectionCard
            id="transactions"
            title="Verifying Transactions (On-Chain)"
            icon={FaExchangeAlt}
          >
            <p className="mb-6">
              Transactions are actions that get recorded on the blockchain. They
              involve sending assets or interacting with smart contracts.
            </p>
            <SubSection title="Key Components to Check" icon={FaEye}>
              <ul className="space-y-2">
                <DetailListItem strongPrefix="Recipient Address (`to`): ">
                  Is this the intended contract or person? Verify on block
                  explorers (Etherscan, Polygonscan, etc.). Look for verified
                  contracts, official labels, official documentation, and transaction history.
                </DetailListItem>
                <DetailListItem strongPrefix="Value (`value`): ">
                  Is this the correct amount of native currency (ETH, MATIC)
                  you're sending? Often zero for contract interactions like
                  approvals or swaps (where tokens are moved by the contract,
                  not sent as `value`).
                </DetailListItem>
                <DetailListItem strongPrefix="Function Call / Method Name: ">
                  What action is being performed (e.g., `transfer`, `approve`,
                  `swapExactTokensForTokens`, `safeMint`)? Does it match your
                  intent?
                </DetailListItem>
                <DetailListItem strongPrefix="Data / Calldata: ">
                  Encoded instructions for the smart contract.
                  <ul className="list-disc list-inside space-y-1 pl-6 mt-2 text-bone-dim">
                    <li>
                      Use calldata decoders to understand the parameters. (See
                      our{" "}
                      <Link
                        href="/tools"
                        className="text-brand hover:text-brand-strong underline"
                      >
                        Tools page
                      </Link>{" "}
                      for decoders).
                    </li>
                    <li>
                      Do the decoded parameters (token addresses, amounts,
                      recipient addresses within the calldata) match your
                      expectations?
                    </li>
                  </ul>
                </DetailListItem>
              </ul>
            </SubSection>

            <SubSection
              title="EIP-7702 Transactions (Set Code)"
              icon={FaFileCode}
            >
              <p className="mb-3 text-bone-dim">
                EIP-7702 allows an Externally Owned Account (EOA) to temporarily
                act like a smart contract for a single transaction by setting
                its `code`. This is a powerful feature that requires careful
                verification:
              </p>
              <ul className="space-y-2">
                <DetailListItem strongPrefix="The `code` being set: ">
                  This is the MOST CRITICAL part. What smart contract logic will
                  your EOA execute?
                  <ul className="list-disc list-inside space-y-1 pl-6 mt-2 text-bone-dim">
                    <li>
                      This code should ideally be from a trusted, audited
                      source.
                    </li>
                    <li>
                      Understand its functionality. Does it perform actions you
                      expect and consent to (e.g., batching transactions,
                      specific contract calls)?
                    </li>
                  </ul>
                </DetailListItem>
                <DetailListItem strongPrefix="The subsequent call: ">
                  After the `code` is set, your EOA will make a call using this
                  new code. Verify this call as you would any other smart
                  contract interaction (recipient, value, calldata).
                </DetailListItem>
                <DetailListItem strongPrefix="Wallet UI: ">
                  Your wallet should clearly indicate this is an EIP-7702
                  transaction and ideally provide a way to inspect or understand
                  the `code` being set (e.g., by showing its hash, linking to a
                  known source, or decoding its intended actions).
                </DetailListItem>
                <DetailListItem strongPrefix="Security Implication: ">
                  Your EOA gains smart contract capabilities for one
                  transaction. Ensure the `code` is safe and does exactly what
                  you intend, as it operates with your EOA's full authority and
                  assets. Malicious `code` could drain your wallet.
                </DetailListItem>
              </ul>
              <p className="mt-4 rounded-lg border border-caution/30 bg-caution/10 p-3 text-sm text-caution">
                <FaInfoCircle size={15} className="mr-2 mb-0.5 inline" />
                Think of it as temporarily lending your account's "keys" to a
                piece of code for one specific job. Make absolutely sure that
                code is trustworthy and will only do that job.
              </p>
            </SubSection>

            <SubSection
              title="Common Transaction Types & Specific Checks"
              icon={FaNetworkWired}
            >
              <ul className="space-y-3">
                <li>
                  <strong className="text-bone">
                    Token Approvals (`approve`, `setApprovalForAll`):
                  </strong>
                  <ul className="list-disc list-inside space-y-1 pl-6 mt-2 text-bone-dim">
                    <li>
                      <strong className="text-bone">Spender:</strong>{" "}
                      CRITICAL! Who are you giving permission to spend your
                      tokens? Ensure it's a trusted dApp/protocol.
                    </li>
                    <li>
                      <strong className="text-bone">
                        Amount (for `approve`):
                      </strong>{" "}
                      Be wary of unlimited approvals (`MAX_UINT256`). Consider
                      specific amounts or use tools like Revoke.cash to manage
                      approvals.
                    </li>
                    <li>
                      <strong className="text-bone">
                        `setApprovalForAll` (NFTs):
                      </strong>{" "}
                      Grants full control over ALL NFTs in a collection to the
                      spender. Extremely risky if the spender is malicious.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong className="text-bone">
                    Swaps (e.g., Uniswap):
                  </strong>
                  <ul className="list-disc list-inside space-y-1 pl-6 mt-2 text-bone-dim">
                    <li>
                      <strong className="text-bone">Router Contract:</strong>{" "}
                      Is it the official DEX router?
                    </li>
                    <li>
                      <strong className="text-bone">
                        Tokens & Amounts:
                      </strong>{" "}
                      Are the input/output tokens and expected amounts (or
                      `amountOutMin`) correct?
                    </li>
                  </ul>
                </li>
                <li>
                  <strong className="text-bone">NFT Mints:</strong>
                  <ul className="list-disc list-inside space-y-1 pl-6 mt-2 text-bone-dim">
                    <li>
                      <strong className="text-bone">
                        Contract Address:
                      </strong>{" "}
                      Is it the official NFT project contract?
                    </li>
                    <li>
                      <strong className="text-bone">Price:</strong> Does the
                      `value` field match the mint price?
                    </li>
                  </ul>
                </li>
              </ul>
            </SubSection>

            <SubSection title="Transaction Red Flags" icon={FaExclamationTriangle}>
              <ul className="space-y-2">
                <RedFlagListItem>
                  Interacting with unverified contracts or addresses with
                  suspicious activity.
                </RedFlagListItem>
                <RedFlagListItem>
                  Unexpected function names or parameters in the decoded
                  calldata.
                </RedFlagListItem>
                <RedFlagListItem>
                  Approving token spends to unknown or suspicious addresses.
                </RedFlagListItem>
                <RedFlagListItem>
                  High transaction `value` for an unfamiliar interaction.
                </RedFlagListItem>
                <RedFlagListItem>
                  Requests to send ETH/native currency to a contract for
                  "verification" or "unlocking funds" (common scam).
                </RedFlagListItem>
                <RedFlagListItem>
                  For EIP-7702, if the `code` is obfuscated, unknown, or its
                  effects are unclear.
                </RedFlagListItem>
              </ul>
            </SubSection>
          </SectionCard>

          {/* Section 2: Verifying Signatures */}
          <SectionCard
            id="signatures"
            title="Verifying Signatures (Off-Chain Messages)"
            icon={FaFileSignature}
          >
            <p className="mb-6">
              Signatures are off-chain confirmations. They don't immediately
              cause a blockchain transaction but can authorize actions, prove
              ownership, or log you into dApps.
              <strong className="text-reject">
                NEVER sign a message you don't fully understand or from an
                untrusted source.
              </strong>
            </p>

            <SubSection
              title="Common Signature Types & What to Check"
              icon={FaEye}
            >
              <ul className="space-y-3">
                <li>
                  <strong className="text-bone">`personal_sign`:</strong>
                  <ul className="list-disc list-inside space-y-1 pl-6 mt-2 text-bone-dim">
                    <li>
                      <strong className="text-bone">Message Content:</strong>{" "}
                      Usually human-readable (e.g., "Sign in to ExampleApp").
                      Read it carefully.
                    </li>
                    <li>
                      <strong className="text-bone">Caution:</strong> Be
                      extremely wary if the message is a long hexadecimal
                      string. It could be a trick to sign a transaction hash or
                      other sensitive data.
                    </li>
                  </ul>
                </li>
                <li>
                  <strong className="text-bone">
                    `eth_signTypedData` (EIP-712):
                  </strong>
                  <ul className="list-disc list-inside space-y-1 pl-6 mt-2 text-bone-dim">
                    <li>
                      <strong className="text-bone">Structured Data:</strong>{" "}
                      Presents data in a more readable, itemized format.
                    </li>
                    <li>
                      <strong className="text-bone">Wallet Display:</strong>{" "}
                      Your wallet should clearly show:
                      <ul className="list-disc list-inside space-y-1 pl-8 mt-1">
                        <li>
                          <strong className="text-bone">
                            Domain Separator:
                          </strong>{" "}
                          Info about the dApp (name, version, chain ID,
                          verifying contract). Verify this matches the dApp
                          you're using.
                        </li>
                        <li>
                          <strong className="text-bone">
                            Message Data:
                          </strong>{" "}
                          The actual values being signed. Read every field.
                        </li>
                        <li>
                          <strong className="text-bone">
                            EIP-712 Raw Data:
                          </strong>{" "}
                          The combination of the domain and message hash, this is exactly what is being signed.
                        </li>
                      </ul>
                    </li>
                    <li>
                      <strong className="text-bone">Common Uses:</strong>{" "}
                      Gasless token approvals (`Permit` for ERC20), off-chain
                      orders, voting.
                    </li>
                    <li>
                      <strong className="text-bone">
                        Example - ERC20 `Permit`:
                      </strong>{" "}
                      Verify `owner` (your address), `spender` (who gets
                      approval), `value` (amount), and `deadline`. This is as
                      critical as an on-chain `approve`.
                    </li>
                  </ul>
                </li>
              </ul>
            </SubSection>

            <SubSection
              title="Verifying the Requesting dApp/Origin"
              icon={FaCheckCircle}
            >
              <ul className="space-y-2">
                <DetailListItem>
                  Ensure the signature request originates from the legitimate
                  website/dApp. Check the URL carefully.
                </DetailListItem>
                <DetailListItem>
                  For EIP-712, the `domain` data in the signature request should
                  match the dApp you believe you are interacting with.
                </DetailListItem>
              </ul>
            </SubSection>

            <SubSection title="Signature Red Flags" icon={FaExclamationTriangle}>
              <ul className="space-y-2">
                <RedFlagListItem>
                  Vague, unclear, or obfuscated messages.
                </RedFlagListItem>
                <RedFlagListItem>
                  `personal_sign` requests with long, unintelligible hexadecimal
                  strings.
                </RedFlagListItem>
                <RedFlagListItem>
                  EIP-712 messages where the `domain` doesn't match the dApp, or
                  message data is unexpected (e.g., approving large amounts to
                  an unknown `spender` via `Permit`).
                </RedFlagListItem>
                <RedFlagListItem>
                  High-pressure tactics urging you to sign quickly.
                </RedFlagListItem>
                <RedFlagListItem>
                  Unexpected signature requests when you haven't initiated an
                  action.
                </RedFlagListItem>
              </ul>
            </SubSection>
          </SectionCard>

          {/* Section: Clear signing standards */}
          <SectionCard
            id="clear-signing"
            title="Clear signing: the standards fighting blind signing"
            icon={FaEye}
          >
            <p>
              Everything above is manual defense against{" "}
              <strong className="text-bone">blind signing</strong> — approving
              data you can&apos;t actually read. Clear signing is the
              ecosystem&apos;s standards-based answer: wallets show a
              human-readable description of what a transaction or message really
              does, instead of raw hex or a bare hash.
            </p>

            <SubSection title="ERC-7730 — human-readable descriptors" icon={FaFileCode}>
              <ul className="space-y-2">
                <DetailListItem strongPrefix="What it is: ">
                  An open standard (see{" "}
                  <a
                    className="text-brand hover:text-brand-strong underline underline-offset-2"
                    href="https://clearsigning.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    clearsigning.org
                  </a>
                  ) where apps and protocols publish JSON &ldquo;descriptors&rdquo;
                  that map a contract&apos;s functions and EIP-712 messages to
                  plain-language display.
                </DetailListItem>
                <DetailListItem strongPrefix="What wallets do with it: ">
                  Wallets (MetaMask, Ledger, Trezor, WalletConnect and others)
                  use those descriptors to show &ldquo;Send 100 USDC to
                  alice.eth&rdquo; instead of an opaque calldata blob. It&apos;s
                  backed by the Ethereum Foundation, major wallets, and security
                  firms including Cyfrin.
                </DetailListItem>
              </ul>
            </SubSection>

            <SubSection title="ERC-8213 — verifiable signing digests" icon={FaFileSignature}>
              <ul className="space-y-2">
                <DetailListItem strongPrefix="What it is: ">
                  A newer, early-stage proposal (see{" "}
                  <a
                    className="text-brand hover:text-brand-strong underline underline-offset-2"
                    href="https://erc8213.eth.limo/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    erc8213.eth.limo
                  </a>
                  ) for presenting a cryptographic fingerprint of exactly what
                  you&apos;re signing, computed client-side so you can verify it
                  independently.
                </DetailListItem>
                <DetailListItem strongPrefix="Why it matters here: ">
                  It&apos;s the standards version of the Safe hash check you
                  practice in this app — confirm the digest your wallet shows
                  matches one you computed yourself, so a compromised UI
                  can&apos;t slip a different payload past you.
                </DetailListItem>
              </ul>
            </SubSection>

            <p className="rounded-lg border border-caution/30 bg-caution/10 p-3 text-sm text-caution">
              <FaInfoCircle size={15} className="mr-2 mb-0.5 inline" />
              Clear signing only helps when a descriptor exists and your wallet
              supports it — and a friendly label is not proof. Until it&apos;s
              everywhere, the manual checks above are your real defense.
            </p>
          </SectionCard>

          {/* Section 3: Security Checklist (General Best Practices) */}
          <SectionCard
            id="checklist"
            title="Wallet Security Checklist"
            icon={FaListAlt}
          >
            <ul className="space-y-3">
              <CheckListItem>
                <strong className="text-bone">
                  Slow Down & Be Skeptical:
                </strong>{" "}
                Don't rush. Scammers often create a false sense of urgency. If
                something feels off, it probably is.
              </CheckListItem>
              <CheckListItem>
                <strong className="text-bone">Use a Hardware Wallet:</strong>{" "}
                For significant assets, a hardware wallet adds a critical layer
                of security by keeping private keys offline. Always verify
                transaction details on the hardware wallet's trusted display.
              </CheckListItem>
              <CheckListItem>
                <strong className="text-bone">
                  Trusted Wallet Software & dApps:
                </strong>{" "}
                Use well-known, reputable wallet software and dApps. Keep them
                updated.
              </CheckListItem>
              <CheckListItem>
                <strong className="text-bone">
                  Transaction Simulators:
                </strong>{" "}
                Tools like WalletGuard, PocketUniverse, Fire, or Tenderly Forks
                can simulate transactions to show potential outcomes *before*
                you sign. Many wallets are integrating these features.
              </CheckListItem>
              <CheckListItem>
                <strong className="text-bone">
                  Verify Contract Addresses & dApp URLs:
                </strong>{" "}
                Always double-check you're interacting with the correct contract
                or official website. Bookmark trusted sites.
              </CheckListItem>
              <CheckListItem>
                <strong className="text-bone">
                  Understand What You're Approving/Signing:
                </strong>{" "}
                If you don't understand it, don't approve it. Ask for
                clarification from trusted community sources if needed.
              </CheckListItem>
              <CheckListItem>
                <strong className="text-bone">
                  Manage Token Approvals:
                </strong>{" "}
                Regularly review and revoke unnecessary token approvals using
                tools like Revoke.cash or Etherscan's token approval checker.
              </CheckListItem>
              <CheckListItem>
                <strong className="text-bone">Beware of Phishing:</strong>{" "}
                Scammers create fake websites, send DMs, or emails impersonating
                projects or support. Never share your seed phrase or private
                keys.
              </CheckListItem>
              <CheckListItem>
                <strong className="text-bone">
                  Educate Yourself Continuously:
                </strong>{" "}
                The Web3 space evolves rapidly. Stay informed about new types of
                scams and security best practices.
              </CheckListItem>
            </ul>
          </SectionCard>

          {/* Key Takeaway Section */}
          <SectionCard
            id="key-takeaway"
            title="Your vigilance is the last line of defense"
            icon={FaLock}
          >
            <p className="text-lg text-bone">
              Diligent verification is your best defense in the Web3 world.
              Every click, every signature, every transaction confirmation
              matters. By understanding the mechanics and potential risks, you
              can significantly enhance your wallet security and navigate the
              decentralized web with greater confidence.
            </p>
            <p className="mt-6">
              For specific tools that can aid in verification, such as calldata
              decoders, please visit our{" "}
              <Link
                href="/tools"
                className="text-brand hover:text-brand-strong underline font-semibold inline-flex items-center gap-1"
              >
                Tools & Resources page <FaExternalLinkAlt size={16} />
              </Link>
              .
            </p>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default VerifyInteractionsPage;