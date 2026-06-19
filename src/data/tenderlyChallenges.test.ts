import { describe, it, expect } from "vitest";
import { isAddress } from "viem";
import {
  buildRun,
  TOTAL_CHALLENGES,
  SEED_TOKENS,
} from "@/data/tenderlyChallenges";

const PLAYER = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" as const;
const CHAIN = 99911155111;

const stable = (v: unknown) =>
  JSON.stringify(v, (_k, val) => (typeof val === "bigint" ? `${val}n` : val));

describe("buildRun", () => {
  it("is deterministic for the same seed/player/chain", () => {
    expect(stable(buildRun(123, PLAYER, CHAIN))).toBe(
      stable(buildRun(123, PLAYER, CHAIN)),
    );
  });

  it("differs across seeds", () => {
    expect(stable(buildRun(1, PLAYER, CHAIN))).not.toBe(
      stable(buildRun(2, PLAYER, CHAIN)),
    );
  });

  it("produces TOTAL_CHALLENGES with levels 1..N in order", () => {
    const run = buildRun(5, PLAYER, CHAIN);
    expect(run).toHaveLength(TOTAL_CHALLENGES);
    expect(run.map((c) => c.level)).toEqual(
      Array.from({ length: TOTAL_CHALLENGES }, (_, i) => i + 1),
    );
  });

  it("every challenge is well-formed across many seeds", () => {
    for (let seed = 0; seed < 60; seed++) {
      for (const c of buildRun(seed, PLAYER, CHAIN)) {
        expect(["sign", "reject"]).toContain(c.expected);
        expect(c.why.length).toBeGreaterThan(0);
        expect(c.fields.length).toBeGreaterThan(0);
        expect(c.title.length).toBeGreaterThan(0);
        if (c.request.kind === "tx") {
          expect(isAddress(c.request.to)).toBe(true);
          if (c.request.data) expect(c.request.data).toMatch(/^0x[0-9a-f]*$/);
        } else {
          expect(c.request.primaryType.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("exercises both safe and trap variants across seeds", () => {
    const decisions = new Set<string>();
    for (let seed = 0; seed < 60; seed++)
      for (const c of buildRun(seed, PLAYER, CHAIN)) decisions.add(c.expected);
    expect(decisions.has("sign")).toBe(true);
    expect(decisions.has("reject")).toBe(true);
  });

  it("binds typed-data signatures to the passed chainId", () => {
    for (const c of buildRun(7, PLAYER, 4242)) {
      if (c.request.kind === "typedData") {
        expect(c.request.domain.chainId).toBe(4242);
      }
    }
  });
});

describe("SEED_TOKENS", () => {
  it("are valid token addresses with positive amounts", () => {
    expect(SEED_TOKENS.length).toBeGreaterThan(0);
    for (const t of SEED_TOKENS) {
      expect(isAddress(t.address)).toBe(true);
      expect(t.amount).toBeGreaterThan(0n);
      expect(t.decimals).toBeGreaterThan(0);
    }
  });
});
