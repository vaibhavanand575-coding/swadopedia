import { BusinessSummary, SearchQuery } from "@/lib/types";
import { generateMockBusinesses } from "@/lib/mockData/businessGenerator";

export interface BusinessSearchProvider {
  /** Returns the top N businesses (best-matching first) for a country/city/sector query. */
  search(query: SearchQuery, count?: number): Promise<BusinessSummary[]>;
}

/**
 * Deterministic offline provider — no network calls, no API key required.
 * This is what the app uses out of the box so it's runnable end to end immediately.
 */
export class MockBusinessSearchProvider implements BusinessSearchProvider {
  async search(query: SearchQuery, count = 5): Promise<BusinessSummary[]> {
    return generateMockBusinesses(query, count);
  }
}

/**
 * Real integration stub for the Google Places API (Text Search).
 * Activates automatically when GOOGLE_PLACES_API_KEY is set — see getBusinessSearchProvider().
 *
 * Docs: https://developers.google.com/maps/documentation/places/web-service/text-search
 */
export class GooglePlacesSearchProvider implements BusinessSearchProvider {
  constructor(private apiKey: string) {}

  async search(query: SearchQuery, count = 5): Promise<BusinessSummary[]> {
    const textQuery = `${query.sector} in ${query.city}, ${query.country}`;
    const res = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": this.apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount," +
          "places.priceLevel,places.internationalPhoneNumber,places.websiteUri,places.types"
      },
      body: JSON.stringify({ textQuery, maxResultCount: Math.min(count, 20) })
    });

    if (!res.ok) {
      throw new Error(`Google Places search failed: ${res.status} ${await res.text()}`);
    }

    const data = (await res.json()) as { places?: Record<string, unknown>[] };
    const places = data.places ?? [];

    return places.slice(0, count).map((p, i) => {
      const displayName = (p.displayName as { text?: string } | undefined)?.text ?? "Unknown";
      const rating = typeof p.rating === "number" ? p.rating : 4;
      const reviewCount = typeof p.userRatingCount === "number" ? p.userRatingCount : 0;
      return {
        id: (p.id as string) ?? `${query.city}-${i}`,
        name: displayName,
        sector: query.sector,
        country: query.country,
        city: query.city,
        address: (p.formattedAddress as string) ?? "",
        phone: (p.internationalPhoneNumber as string) ?? "",
        website: (p.websiteUri as string) ?? null,
        // Places API does not expose Instagram handles — left blank for the operator to fill in,
        // or resolved by a follow-up lookup (e.g. a site scrape) before the brand-assets stage.
        instagramHandle: "",
        rating,
        reviewCount,
        priceLevel: (typeof p.priceLevel === "number" ? p.priceLevel : 2) as 1 | 2 | 3 | 4,
        tags: (p.types as string[] | undefined)?.slice(0, 3) ?? [],
        shortDescription: `${displayName} — a ${query.sector} in ${query.city}.`,
        matchScore: Math.round(rating * 15 + Math.min(reviewCount, 1500) / 60)
      } satisfies BusinessSummary;
    });
  }
}

/** Picks the real provider when configured, otherwise falls back to the offline mock. */
export function getBusinessSearchProvider(): BusinessSearchProvider {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (apiKey) return new GooglePlacesSearchProvider(apiKey);
  return new MockBusinessSearchProvider();
}
