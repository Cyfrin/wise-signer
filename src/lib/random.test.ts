import { describe, it, expect } from "vitest";
import { isAddress } from "viem";
import {
  makeRng,
  pick,
  chance,
  randInt,
  randomHexAddress,
  lookAlike,
} from "@/lib/random";

describe("makeRng", () => {
  it("is deterministic for a given seed", () => {
    const a = makeRng(42);
    const b = makeRng(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });

  it("differs across seeds", () => {
    expect(makeRng(1)()).not.toBe(makeRng(2)());
  });

  it("returns values in [0, 1)", () => {
    const r = makeRng(7);
    for (let i = 0; i < 200; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("pick / chance / randInt", () => {
  it("pick returns a member of the array", () => {
    const r = makeRng(3);
    const arr = ["a", "b", "c"] as const;
    for (let i = 0; i < 50; i++) expect(arr).toContain(pick(r, arr));
  });

  it("chance returns a boolean", () => {
    expect(typeof chance(makeRng(4))).toBe("boolean");
  });

  it("randInt stays within inclusive bounds", () => {
    const r = makeRng(5);
    for (let i = 0; i < 200; i++) {
      const v = randInt(r, 5, 9);
      expect(v).toBeGreaterThanOrEqual(5);
      expect(v).toBeLessThanOrEqual(9);
      expect(Number.isInteger(v)).toBe(true);
    }
  });
});

describe("randomHexAddress", () => {
  it("produces a valid lowercase 20-byte address", () => {
    const a = randomHexAddress(makeRng(9));
    expect(a).toMatch(/^0x[0-9a-f]{40}$/);
    expect(isAddress(a)).toBe(true);
  });
});

describe("lookAlike", () => {
  const ORIG = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"; // checksummed

  it("is lowercase and passes EIP-55 validation (the bug that crashed level 5)", () => {
    const fake = lookAlike(makeRng(11), ORIG);
    expect(fake).toMatch(/^0x[0-9a-f]{40}$/);
    expect(isAddress(fake)).toBe(true);
  });

  it("shares head and tail but differs from the original", () => {
    const fake = lookAlike(makeRng(11), ORIG);
    const clean = ORIG.slice(2).toLowerCase();
    expect(fake.slice(2, 6)).toBe(clean.slice(0, 4)); // head
    expect(fake.slice(-4)).toBe(clean.slice(-4)); // tail
    expect(fake.slice(2)).not.toBe(clean); // middle differs
  });

  it("is deterministic for a seed", () => {
    expect(lookAlike(makeRng(5), ORIG)).toBe(lookAlike(makeRng(5), ORIG));
  });
});
