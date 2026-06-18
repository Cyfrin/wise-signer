import {
  CUSTOM_CHAIN_ID,
  SEPOLIA_NETWORK_ID,
  VIRTUAL_NET_NAME,
  VIRTUAL_NET_DISPLAY_NAME,
  VIRTUAL_NET_DESCRIPTION,
} from "@/app/constants";

export interface VnetInfo {
  publicRpcUrl: string;
  adminRpcUrl?: string;
  vnetId?: string;
  chainIdHex: string;
}

interface TenderlyRpcEntry {
  name: string;
  url: string;
}

/**
 * Create a Tenderly Virtual TestNet that forks Sepolia, using the caller's own
 * API key (bring-your-own-key — nothing is stored server-side). Returns both the
 * public RPC (for the player's wallet) and the admin RPC (for seeding ETH).
 */
export async function provisionVnet(
  apiKey: string,
  account: string,
  project: string,
  slug: string = VIRTUAL_NET_NAME,
): Promise<VnetInfo> {
  const res = await fetch(
    `https://api.tenderly.co/api/v1/account/${account}/project/${project}/vnets`,
    {
      method: "POST",
      headers: { "X-Access-Key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        slug,
        display_name: VIRTUAL_NET_DISPLAY_NAME,
        description: VIRTUAL_NET_DESCRIPTION,
        fork_config: { network_id: SEPOLIA_NETWORK_ID, block_number: "latest" },
        virtual_network_config: { chain_config: { chain_id: CUSTOM_CHAIN_ID } },
        sync_state_config: { enabled: false },
        explorer_page_config: { enabled: false, verification_visibility: "src" },
      }),
    },
  );

  if (res.status === 409) {
    throw new Error(
      'A Wise Signer network already exists in this project. Open it in your Tenderly dashboard, copy the Public and Admin RPC URLs, and use the "I already have a network" option.',
    );
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(
      `Tenderly returned ${res.status} ${res.statusText}. ${detail}`.trim(),
    );
  }

  const data = await res.json();
  const rpcs: TenderlyRpcEntry[] = data.rpcs ?? [];
  const byName = (n: string) => rpcs.find((r) => r.name === n)?.url;
  const publicRpcUrl = byName("Public RPC") ?? rpcs[0]?.url;
  const adminRpcUrl = byName("Admin RPC");

  if (!publicRpcUrl) throw new Error("No RPC URL found in the Tenderly response.");

  return {
    publicRpcUrl,
    adminRpcUrl,
    vnetId: data.id,
    chainIdHex: `0x${CUSTOM_CHAIN_ID.toString(16)}`,
  };
}

export async function rpcCall<T = unknown>(
  rpcUrl: string,
  method: string,
  params: unknown[],
): Promise<T> {
  const res = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.message ?? `RPC ${method} failed`);
  return json.result as T;
}

const toWeiHex = (eth: number) => `0x${(BigInt(eth) * 10n ** 18n).toString(16)}`;

/** Fund an address with native ETH on the vnet (Tenderly cheat method). */
export async function fundAddress(
  adminRpcUrl: string,
  address: string,
  eth = 100,
): Promise<void> {
  await rpcCall(adminRpcUrl, "tenderly_setBalance", [[address], toWeiHex(eth)]);
}

/** Set an ERC-20 balance for an address on the vnet (Tenderly cheat method). */
export async function setErc20Balance(
  adminRpcUrl: string,
  token: string,
  address: string,
  amount: bigint,
): Promise<void> {
  await rpcCall(adminRpcUrl, "tenderly_setErc20Balance", [
    token,
    address,
    `0x${amount.toString(16)}`,
  ]);
}
