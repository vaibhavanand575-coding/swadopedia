import { BrandAsset, BusinessSummary, Sector } from "@/lib/types";
import { pick, randInt, seededRandom } from "@/lib/rng";

export interface BrandAssetProvider {
  /** Returns a profile image plus a handful of "recent post" images for a business. */
  fetchAssets(business: BusinessSummary, count?: number): Promise<BrandAsset[]>;
}

const SECTOR_PALETTES: Record<Sector, string[][]> = {
  cafe: [
    ["#6f4e37", "#c8a27a"],
    ["#3e2c23", "#b08968"],
    ["#5c4033", "#e6ccb2"]
  ],
  restaurant: [
    ["#7a1f1f", "#d4a017"],
    ["#2f3e2f", "#c9a66b"],
    ["#4a1c1c", "#e0b34a"]
  ],
  gym: [
    ["#111827", "#f97316"],
    ["#0f172a", "#22d3ee"],
    ["#1c1917", "#ef4444"]
  ]
};

const CAPTIONS: Record<Sector, string[]> = {
  cafe: [
    "Fresh pour-over, every morning ☕",
    "New seasonal blend just dropped",
    "Sunday mornings, best mornings",
    "Latte art practice never stops",
    "Fresh pastries out of the oven"
  ],
  restaurant: [
    "Tonight's special, plated with love",
    "Fresh ingredients, sourced daily",
    "Behind the scenes in the kitchen",
    "Full house on a Friday night",
    "New menu just launched"
  ],
  gym: [
    "Morning crew crushing it 💪",
    "New PR alert!",
    "Group class energy is unmatched",
    "Recovery day essentials",
    "New equipment just arrived"
  ]
};

/** Builds a small self-contained SVG "photo" so the app never depends on external images. */
function svgPlaceholder(seedText: string, colors: [string, string], label: string): string {
  const rand = seededRandom(seedText);
  const angle = randInt(rand, 0, 360);
  const shapeCx = randInt(rand, 20, 80);
  const shapeCy = randInt(rand, 20, 80);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="g" gradientTransform="rotate(${angle})">
        <stop offset="0%" stop-color="${colors[0]}"/>
        <stop offset="100%" stop-color="${colors[1]}"/>
      </linearGradient>
    </defs>
    <rect width="100" height="100" fill="url(#g)"/>
    <circle cx="${shapeCx}" cy="${shapeCy}" r="26" fill="#ffffff" fill-opacity="0.12"/>
    <circle cx="${100 - shapeCx}" cy="${100 - shapeCy}" r="16" fill="#ffffff" fill-opacity="0.10"/>
    <text x="50" y="94" font-family="Helvetica, Arial, sans-serif" font-size="6" fill="#ffffff"
      fill-opacity="0.85" text-anchor="middle">${label}</text>
  </svg>`;
  const base64 = Buffer.from(svg).toString("base64");
  return `data:image/svg+xml;base64,${base64}`;
}

/**
 * Generates deterministic, brand-styled placeholder imagery in place of a live Instagram pull.
 *
 * A real integration would use the official Instagram Graph API against a *connected* business
 * account (see InstagramGraphApiProvider below) — there is no ToS-compliant way to scrape or pull
 * media from an arbitrary third-party Instagram account without their consent/access token, so
 * this mock provider is what powers the "pick images from Instagram" stage until the business
 * owner connects their own account.
 */
export class MockBrandAssetProvider implements BrandAssetProvider {
  async fetchAssets(business: BusinessSummary, count = 4): Promise<BrandAsset[]> {
    const palette = pick(seededRandom(business.id + "|palette"), SECTOR_PALETTES[business.sector]) as [
      string,
      string
    ];
    const captions = CAPTIONS[business.sector];
    const assets: BrandAsset[] = [];

    assets.push({
      id: `${business.id}-profile`,
      kind: "profile",
      caption: `${business.name} profile photo`,
      url: svgPlaceholder(`${business.id}|profile`, palette, business.name),
      dominantColor: palette[0],
      likeCount: randInt(seededRandom(`${business.id}|profile|likes`), 80, 900)
    });

    for (let i = 0; i < count; i++) {
      const rand = seededRandom(`${business.id}|post|${i}`);
      const caption = pick(rand, captions);
      assets.push({
        id: `${business.id}-post-${i}`,
        kind: "post",
        caption,
        url: svgPlaceholder(`${business.id}|post|${i}`, palette, business.sector.toUpperCase()),
        dominantColor: i % 2 === 0 ? palette[0] : palette[1],
        likeCount: randInt(rand, 20, 640)
      });
    }

    return assets;
  }
}

/**
 * Real integration stub for the official Instagram Graph API. Requires the business to have
 * connected their Instagram professional account and issued a long-lived access token — set
 * INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_BUSINESS_ID to activate.
 *
 * Docs: https://developers.facebook.com/docs/instagram-api/guides/content-publishing
 */
export class InstagramGraphApiProvider implements BrandAssetProvider {
  constructor(private accessToken: string, private igBusinessId: string) {}

  async fetchAssets(business: BusinessSummary, count = 4): Promise<BrandAsset[]> {
    const fields = "id,caption,media_type,media_url,like_count,timestamp";
    const url = `https://graph.facebook.com/v19.0/${this.igBusinessId}/media?fields=${fields}&limit=${count}&access_token=${this.accessToken}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Instagram Graph API request failed: ${res.status} ${await res.text()}`);
    }
    const data = (await res.json()) as {
      data?: { id: string; caption?: string; media_url?: string; like_count?: number }[];
    };

    return (data.data ?? []).map((m) => ({
      id: m.id,
      kind: "post" as const,
      caption: m.caption ?? "",
      url: m.media_url ?? "",
      dominantColor: "#333333",
      likeCount: m.like_count ?? 0
    }));
  }
}

export function getBrandAssetProvider(): BrandAssetProvider {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const igBusinessId = process.env.INSTAGRAM_BUSINESS_ID;
  if (token && igBusinessId) return new InstagramGraphApiProvider(token, igBusinessId);
  return new MockBrandAssetProvider();
}
