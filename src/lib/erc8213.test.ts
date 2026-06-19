import { describe, it, expect } from "vitest";
import { encodeFunctionData, parseUnits } from "viem";
import { calldataDigest, eip712Digest } from "@/lib/erc8213";

describe("calldataDigest", () => {
  it("matches the ERC-8213 spec test vector", () => {
    // From the ERC-8213 spec: an ERC-20 transfer(address,uint256) calldata.
    const calldata =
      "0xa9059cbb0000000000000000000000004675c7e5baafbffbca748158becba61ef3b0a2630000000000000000000000000000000000000000000000000de0b6b3a7640000";
    expect(calldataDigest(calldata)).toBe(
      "0x812cee5d9cc7461c04bbcd7b70af9c28b243ac5d74d3453b008b93b7dac69985",
    );
  });

  it("returns a 32-byte hash for empty calldata", () => {
    expect(calldataDigest("0x")).toMatch(/^0x[0-9a-f]{64}$/);
  });

  it("changes when the calldata changes", () => {
    expect(calldataDigest("0xdeadbeef")).not.toBe(calldataDigest("0xdeadbee0"));
  });
});

describe("eip712Digest", () => {
  it("computes the SafeTx EIP-712 digest (regression)", () => {
    const data = encodeFunctionData({
      abi: [
        {
          name: "transfer",
          type: "function",
          stateMutability: "nonpayable",
          inputs: [
            { name: "to", type: "address" },
            { name: "a", type: "uint256" },
          ],
          outputs: [{ type: "bool" }],
        },
      ],
      functionName: "transfer",
      args: ["0x1111111111111111111111111111111111111111", parseUnits("500", 6)],
    });
    const digest = eip712Digest({
      domain: {
        chainId: 99911155111,
        verifyingContract: "0x2222222222222222222222222222222222222222",
      },
      types: {
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
      },
      primaryType: "SafeTx",
      message: {
        to: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
        value: 0n,
        data,
        operation: 1,
        safeTxGas: 0n,
        baseGas: 0n,
        gasPrice: 0n,
        gasToken: "0x0000000000000000000000000000000000000000",
        refundReceiver: "0x0000000000000000000000000000000000000000",
        nonce: 5n,
      },
    });
    expect(digest).toBe(
      "0x99f169201829eb132e0493d3783ce85d8b4b91deb2fc248d85cb4532cbe55a0e",
    );
  });

  it("changes with the chainId (domain binding)", () => {
    const base = {
      types: { Vote: [{ name: "support", type: "bool" }] },
      primaryType: "Vote",
      message: { support: true },
    };
    const a = eip712Digest({ ...base, domain: { chainId: 1 } });
    const b = eip712Digest({ ...base, domain: { chainId: 2 } });
    expect(a).not.toBe(b);
  });
});
