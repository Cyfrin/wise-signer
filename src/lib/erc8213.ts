import { keccak256, encodePacked, size, hashTypedData, type Hex } from "viem";

/**
 * ERC-8213 digests (https://erc8213.eth.limo/), so feedback can show the value a
 * wallet that supports the standard would display for independent verification.
 */

/** Calldata Digest: keccak256(uint256(len(calldata)) || calldata). */
export function calldataDigest(calldata: Hex): Hex {
  return keccak256(
    encodePacked(["uint256", "bytes"], [BigInt(size(calldata)), calldata]),
  );
}

/** EIP-712 Digest: keccak256("\x19\x01" || domainSeparator || hashStruct(message)). */
export function eip712Digest(req: {
  domain: Record<string, unknown>;
  types: Record<string, { name: string; type: string }[]>;
  primaryType: string;
  message: Record<string, unknown>;
}): Hex {
  return hashTypedData({
    domain: req.domain,
    types: req.types,
    primaryType: req.primaryType,
    message: req.message,
  } as Parameters<typeof hashTypedData>[0]);
}
