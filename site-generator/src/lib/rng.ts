// Small deterministic PRNG so the same (country, city, sector) search always returns the same
// 5 businesses, and the same business always produces the same "research" / imagery / copy.
// Swapping in real providers (Google Places, Instagram Graph API) removes the need for this —
// it exists purely to make the mock data mode reproducible and demo-friendly.

export function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Mulberry32 — tiny, fast, good-enough-for-mock-data seeded RNG. */
export function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededRandom(seedText: string): () => number {
  return mulberry32(hashSeed(seedText));
}

export function pick<T>(rand: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length) % arr.length];
}

export function pickN<T>(rand: () => number, arr: readonly T[], n: number): T[] {
  const pool = [...arr];
  const out: T[] = [];
  while (out.length < n && pool.length > 0) {
    const idx = Math.floor(rand() * pool.length) % pool.length;
    out.push(pool.splice(idx, 1)[0]);
  }
  return out;
}

export function randInt(rand: () => number, min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

export function randFloat(rand: () => number, min: number, max: number, decimals = 1): number {
  const v = rand() * (max - min) + min;
  const p = Math.pow(10, decimals);
  return Math.round(v * p) / p;
}
