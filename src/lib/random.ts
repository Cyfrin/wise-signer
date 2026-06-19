// Seedable PRNG so a Tenderly run is stable on reload but differs across runs.
// (Browser-only app code — Math.random is used once to mint a fresh seed.)

export type Rng = () => number;

/** Mulberry32 — small, fast, deterministic from a 32-bit seed. */
export function makeRng(seed: number): Rng {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function freshSeed(): number {
  return Math.floor(Math.random() * 0xffffffff) >>> 0;
}

export function pick<T>(rng: Rng, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)] as T;
}

export function chance(rng: Rng, p = 0.5): boolean {
  return rng() < p;
}

export function randInt(rng: Rng, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function randomHexAddress(rng: Rng): `0x${string}` {
  const hex = "0123456789abcdef";
  let s = "0x";
  for (let i = 0; i < 40; i++) s += hex[Math.floor(rng() * 16)];
  return s as `0x${string}`;
}

/**
 * Build an address-poisoning look-alike of `addr`: it shares the first and
 * last `keep` hex characters but the middle differs. This is the trick that
 * fools anyone who only checks the truncated 0x1234…abcd form.
 */
export function lookAlike(rng: Rng, addr: string, keep = 4): `0x${string}` {
  // Lowercase: copying head/tail from a checksummed address would yield a
  // mixed-case string that fails EIP-55 validation (viem rejects it).
  const clean = addr.replace(/^0x/, "").toLowerCase().padEnd(40, "0").slice(0, 40);
  const head = clean.slice(0, keep);
  const tail = clean.slice(-keep);
  const hex = "0123456789abcdef";
  let mid = "";
  for (let i = 0; i < 40 - keep * 2; i++) {
    mid += hex[Math.floor(rng() * 16)];
  }
  return `0x${head}${mid}${tail}` as `0x${string}`;
}
