import {
  encodeFunctionData,
  parseEther,
  parseUnits,
  maxUint256,
  type Address,
} from "viem";
import {
  type Rng,
  makeRng,
  pick,
  chance,
  randInt,
  randomHexAddress,
  lookAlike,
} from "@/lib/random";

export type Decision = "sign" | "reject";

export interface TxRequest {
  kind: "tx";
  to: Address;
  value?: bigint;
  data?: `0x${string}`;
}

export interface TypedDataRequest {
  kind: "typedData";
  domain: Record<string, unknown>;
  types: Record<string, { name: string; type: string }[]>;
  primaryType: string;
  message: Record<string, unknown>;
}

export type WalletRequest = TxRequest | TypedDataRequest;

export interface ReviewField {
  label: string;
  value: string;
  /** Render full-width monospace (for addresses / calldata the player must scrutinize). */
  block?: boolean;
}

export interface Challenge {
  level: number;
  title: string;
  origin: string; // the "site" requesting it
  intent: string; // what the player is trying to do (their reference truth)
  fields: ReviewField[];
  request: WalletRequest;
  expected: Decision;
  why: string; // shown after the decision
  note?: string; // standing context (token address, decimals, funding)
}

// Real Sepolia USDC — present on the forked vnet, so the wallet shows real
// metadata and we can fund a balance with tenderly_setErc20Balance.
const USDC: Address = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"; // 6 decimals

const USDC_NOTE = `On this testnet, USDC is the real contract at ${USDC} with 6 decimals — the same as mainnet USDC. Your wallet has been funded with test USDC to spend.`;

const CONTACTS = ["Dani", "Mae", "Theo", "Priya", "Kofi", "Lena"] as const;

const ZERO: Address = "0x0000000000000000000000000000000000000000";

const erc20Abi = [
  { name: "transfer", type: "function", stateMutability: "nonpayable", inputs: [{ name: "to", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ type: "bool" }] },
  { name: "approve", type: "function", stateMutability: "nonpayable", inputs: [{ name: "spender", type: "address" }, { name: "amount", type: "uint256" }], outputs: [{ type: "bool" }] },
  { name: "claim", type: "function", stateMutability: "nonpayable", inputs: [], outputs: [] },
] as const;

const SAFE_TX_TYPES = {
  SafeTx: [
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "data", type: "bytes" },
    { name: "operation", type: "uint8" },
    { name: "safeTxGas", type: "uint256" },
    { name: "baseGas", type: "uint256" },
    { name: "gasPrice", type: "uint256" },
    { name: "gasToken", type: "address" },
    { name: "refundReceiver", type: "address" },
    { name: "nonce", type: "uint256" },
  ],
};

const usdc = (n: number) => parseUnits(String(n), 6);

// ---- Level generators ----------------------------------------------------

function nativeTransfer(rng: Rng, player: Address): Challenge {
  const name = pick(rng, CONTACTS);
  const contact = randomHexAddress(rng);
  const amount = pick(rng, [0.05, 0.2, 0.5, 1, 1.5]);
  const trap = chance(rng);
  const to = trap ? lookAlike(rng, contact) : contact;
  return {
    level: 1,
    title: "Pay a saved contact",
    origin: "your wallet",
    intent: `Send ${amount} ETH to ${name}, whose address is ${contact}.`,
    fields: [
      { label: "Network", value: "Wise Signer testnet" },
      { label: "To", value: to, block: true },
      { label: "Amount", value: `${amount} ETH` },
    ],
    request: { kind: "tx", to, value: parseEther(String(amount)) },
    expected: trap ? "reject" : "sign",
    why: trap
      ? `Address poisoning. The recipient shares ${name}'s first and last characters but the middle differs — it's an attacker's look-alike. Truncated addresses (0x1234…abcd) hide exactly this. Always compare the full string.`
      : `The recipient matches ${name}'s address character-for-character and the amount is right. Safe to sign.`,
  };
}

function tokenTransfer(rng: Rng, player: Address): Challenge {
  const name = pick(rng, CONTACTS);
  const contact = randomHexAddress(rng);
  const amount = pick(rng, [50, 120, 250, 500]);
  const trap = chance(rng);
  const to = trap ? lookAlike(rng, contact) : contact;
  return {
    level: 2,
    title: "Send a token to a contact",
    note: USDC_NOTE,
    origin: "your wallet",
    intent: `Send ${amount} USDC to ${name} at ${contact}.`,
    fields: [
      { label: "Token", value: `USDC · ${USDC}`, block: true },
      { label: "Function", value: "transfer(to, amount)" },
      { label: "Recipient", value: to, block: true },
      { label: "Amount", value: `${amount} USDC` },
    ],
    request: {
      kind: "tx",
      to: USDC,
      data: encodeFunctionData({ abi: erc20Abi, functionName: "transfer", args: [to, usdc(amount)] }),
    },
    expected: trap ? "reject" : "sign",
    why: trap
      ? `The recipient inside the transfer calldata is a poisoned look-alike of ${name}'s address. The wallet shows the decoded recipient — compare it to who you meant to pay.`
      : `Decoded recipient matches ${name} and the amount is correct. Safe to sign.`,
  };
}

function tokenApproval(rng: Rng, player: Address): Challenge {
  const pool = randomHexAddress(rng);
  const attacker = randomHexAddress(rng);
  const deposit = pick(rng, [200, 500, 1000]);
  const trap = chance(rng);
  const spender = trap ? attacker : pool;
  const amount = trap ? maxUint256 : usdc(deposit);
  return {
    level: 3,
    title: "Approve a token spend",
    note: USDC_NOTE,
    origin: "app.aave.com",
    intent: `Deposit ${deposit} USDC into Aave. Its pool contract is ${pool}, so it needs approval for ${deposit} USDC.`,
    fields: [
      { label: "Token", value: `USDC · ${USDC}`, block: true },
      { label: "Function", value: "approve(spender, amount)" },
      { label: "Spender", value: spender, block: true },
      { label: "Amount", value: trap ? "Unlimited (2^256 − 1)" : `${deposit} USDC` },
    ],
    request: {
      kind: "tx",
      to: USDC,
      data: encodeFunctionData({ abi: erc20Abi, functionName: "approve", args: [spender, amount] }),
    },
    expected: trap ? "reject" : "sign",
    why: trap
      ? `Two red flags: the spender isn't the Aave pool you were told about, and it's an unlimited approval. An unlimited allowance to an unknown contract can drain that token forever.`
      : `The spender matches Aave's pool and the amount is scoped to your ${deposit} USDC deposit. Reasonable to sign.`,
  };
}

function safeTxSignature(rng: Rng, player: Address, chainId: number): Challenge {
  const safe = randomHexAddress(rng);
  const recipient = randomHexAddress(rng);
  const amount = pick(rng, [250, 500, 1000]);
  const nonce = randInt(rng, 1, 40);
  const trap = chance(rng);
  const operation = trap ? 1 : 0; // 1 = DELEGATECALL — the Bybit-style trap
  return {
    level: 4,
    title: "Sign a Safe multisig transaction",
    note: USDC_NOTE,
    origin: "app.safe.global",
    intent: `You're a signer on a 2-of-3 Safe at ${safe}. Approve sending ${amount} USDC to ${recipient}. A normal token transfer uses operation 0 (a CALL).`,
    fields: [
      { label: "Type", value: "EIP-712 · SafeTx" },
      { label: "Safe", value: safe, block: true },
      { label: "To (token)", value: USDC, block: true },
      { label: "Operation", value: operation === 1 ? "1 — DELEGATECALL" : "0 — CALL" },
      { label: "Nonce", value: String(nonce) },
    ],
    request: {
      kind: "typedData",
      domain: { chainId, verifyingContract: safe },
      types: SAFE_TX_TYPES,
      primaryType: "SafeTx",
      message: {
        to: USDC,
        value: 0n,
        data: encodeFunctionData({ abi: erc20Abi, functionName: "transfer", args: [recipient, usdc(amount)] }),
        operation,
        safeTxGas: 0n,
        baseGas: 0n,
        gasPrice: 0n,
        gasToken: ZERO,
        refundReceiver: ZERO,
        nonce: BigInt(nonce),
      },
    },
    expected: trap ? "reject" : "sign",
    why: trap
      ? `The **operation is 1 (DELEGATECALL)** — the Safe would run the target's code in its own storage, which can rewrite the owners and drain everything. A token transfer must be operation **0 (CALL)**. This is the trick behind the Bybit hack ($1.4B).`
      : `Operation is 0 (a normal CALL), the inner call is a standard USDC transfer to your intended recipient, and the Safe address matches. Safe to sign.`,
  };
}

function permitSignature(rng: Rng, player: Address, chainId: number): Challenge {
  const pool = randomHexAddress(rng);
  const attacker = randomHexAddress(rng);
  const deposit = pick(rng, [250, 500, 1000]);
  const trap = chance(rng);
  const spender = trap ? attacker : pool;
  const value = trap ? maxUint256 : usdc(deposit);
  const deadline = BigInt(1_900_000_000);
  return {
    level: 5,
    title: "Sign a gasless permit",
    note: USDC_NOTE,
    origin: "app.aave.com",
    intent: `Approve ${deposit} USDC to Aave's pool (${pool}) with a gasless Permit signature — no gas, but it authorizes spending just like an on-chain approval.`,
    fields: [
      { label: "Type", value: "EIP-712 · Permit" },
      { label: "Owner (you)", value: player, block: true },
      { label: "Spender", value: spender, block: true },
      { label: "Value", value: trap ? "Unlimited (2^256 − 1)" : `${deposit} USDC` },
    ],
    request: {
      kind: "typedData",
      domain: { name: "USD Coin", version: "2", chainId, verifyingContract: USDC },
      types: {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ],
      },
      primaryType: "Permit",
      message: { owner: player, spender, value, nonce: 0n, deadline },
    },
    expected: trap ? "reject" : "sign",
    why: trap
      ? `A Permit signature is as powerful as an on-chain approval — and this one grants an unlimited allowance to an address that isn't the Aave pool. Signatures can drain you just like transactions.`
      : `The permit's spender matches Aave's pool and the value is scoped to your deposit. Signing this is equivalent to a sensible approval.`,
  };
}

function delegateSignature(rng: Rng, player: Address, chainId: number): Challenge {
  const token = randomHexAddress(rng); // governance token contract
  const attacker = randomHexAddress(rng);
  const nonce = randInt(rng, 0, 12);
  const trap = chance(rng);
  const delegatee = trap ? attacker : player;
  const expiry = BigInt(1_900_000_000);
  return {
    level: 6,
    title: "Delegate your governance votes",
    origin: "app.governance.xyz",
    intent: `Delegate your voting power to yourself (${player}) so you can vote. The delegatee should be your own address.`,
    fields: [
      { label: "Type", value: "EIP-712 · Delegation" },
      { label: "Token", value: token, block: true },
      { label: "Delegatee", value: delegatee, block: true },
      { label: "Nonce", value: String(nonce) },
    ],
    request: {
      kind: "typedData",
      domain: { name: "Governance Token", version: "1", chainId, verifyingContract: token },
      types: {
        Delegation: [
          { name: "delegatee", type: "address" },
          { name: "nonce", type: "uint256" },
          { name: "expiry", type: "uint256" },
        ],
      },
      primaryType: "Delegation",
      message: { delegatee, nonce: BigInt(nonce), expiry },
    },
    expected: trap ? "reject" : "sign",
    why: trap
      ? `The delegatee is an unknown address, not you. Signing this hands your voting power to an attacker, who could push through malicious proposals with your votes. The delegatee must be the address you intend — here, your own.`
      : `The delegatee is your own address, exactly as intended. Safe to sign — you keep your voting power.`,
  };
}

function maliciousCalldata(rng: Rng, player: Address): Challenge {
  const airdrop = randomHexAddress(rng);
  const attacker = randomHexAddress(rng);
  const trap = chance(rng);
  const reward = pick(rng, [500, 1000, 2500]);
  const data = trap
    ? encodeFunctionData({ abi: erc20Abi, functionName: "approve", args: [attacker, maxUint256] })
    : encodeFunctionData({ abi: erc20Abi, functionName: "claim", args: [] });
  return {
    level: 7,
    title: "Read the calldata",
    note: USDC_NOTE,
    origin: "claim-rewards.xyz",
    intent: `The site says: "Claim your ${reward} TOKEN airdrop." A claim should just call claim() on the airdrop contract (${airdrop}).`,
    fields: [
      { label: "To", value: trap ? USDC : airdrop, block: true },
      { label: "Decoded call", value: trap ? "approve(spender, amount)" : "claim()" },
      ...(trap
        ? ([
            { label: "Spender", value: attacker, block: true },
            { label: "Amount", value: "Unlimited (2^256 − 1)" },
          ] as ReviewField[])
        : []),
      { label: "Raw calldata", value: data, block: true },
    ],
    request: { kind: "tx", to: trap ? USDC : airdrop, data },
    expected: trap ? "reject" : "sign",
    why: trap
      ? `The button says "claim," but the decoded calldata is an unlimited approve() of your USDC to an unknown address. The label lies; the calldata is the truth. Reject.`
      : `The decoded call really is claim() on the airdrop contract the site named. It matches the stated intent. Safe to sign.`,
  };
}

type Generator = (rng: Rng, player: Address, chainId: number) => Challenge;

const GENERATORS: Generator[] = [
  nativeTransfer,
  tokenTransfer,
  tokenApproval,
  safeTxSignature,
  permitSignature,
  delegateSignature,
  maliciousCalldata,
];

/** Build a full, deterministic-for-the-seed run of challenges for a player. */
export function buildRun(
  seed: number,
  player: Address,
  chainId: number,
): Challenge[] {
  const rng = makeRng(seed);
  return GENERATORS.map((gen) => gen(rng, player, chainId));
}

export const TOTAL_CHALLENGES = GENERATORS.length;

/** Tokens funded on the player's wallet before a run, via tenderly_setErc20Balance. */
export const SEED_TOKENS: {
  address: Address;
  symbol: string;
  decimals: number;
  amount: bigint;
}[] = [{ address: USDC, symbol: "USDC", decimals: 6, amount: 10_000n * 10n ** 6n }];
