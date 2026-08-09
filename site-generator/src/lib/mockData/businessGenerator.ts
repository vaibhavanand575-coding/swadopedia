import { BusinessSummary, SearchQuery, Sector } from "@/lib/types";
import { pick, pickN, randFloat, randInt, seededRandom } from "@/lib/rng";

const NAME_PARTS: Record<Sector, { prefixes: string[]; nouns: string[] }> = {
  cafe: {
    prefixes: ["Copper", "Velvet", "Daily", "Morning", "The Roasted", "Little", "Third Wave", "Amber", "Corner", "Sunlit"],
    nouns: ["Bean Co.", "Grind", "Cup", "Roastery", "Espresso Bar", "Brew House", "Coffee Room", "Kettle", "Press"]
  },
  restaurant: {
    prefixes: ["The Golden", "Spice", "Coastal", "Rustic", "Urban", "Heritage", "Copper Pot", "Lantern", "Harbor", "Stone Oven"],
    nouns: ["Kitchen", "Table", "Bistro", "Grill", "Tavern", "Diner", "Eatery", "House", "Kitchen & Bar"]
  },
  gym: {
    prefixes: ["Iron", "Peak", "Pulse", "Forge", "Momentum", "Apex", "Core", "Elevate", "Ironclad", "Summit"],
    nouns: ["Fitness Studio", "Gym", "Performance Lab", "Strength Club", "Training Co.", "Athletic Club", "Barbell Club", "Fit Studio"]
  }
};

const SECTOR_TAGS: Record<Sector, string[]> = {
  cafe: ["specialty coffee", "vegan-friendly", "free wifi", "outdoor seating", "pastries", "single-origin", "cold brew", "cozy"],
  restaurant: ["fine dining", "family-friendly", "vegetarian options", "live music", "chef's tasting menu", "local ingredients", "rooftop seating", "wine list"],
  gym: ["personal training", "group classes", "24/7 access", "yoga studio", "crossfit box", "sauna", "childcare", "nutrition coaching"]
};

const STREET_NAMES = ["Main St", "Market St", "Church Rd", "Station Rd", "Park Ave", "High St", "Mill Ln", "5th Ave", "Elm St", "River Rd"];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

/**
 * Deterministic mock "local business search". Given the same (country, city, sector) it always
 * returns the same 5 ranked businesses — this stands in for a real Places-style API call.
 * Swap in `GooglePlacesSearchProvider` (see businessSearch.ts) once you have an API key.
 */
export function generateMockBusinesses(query: SearchQuery, count = 5): BusinessSummary[] {
  const { country, city, sector } = query;
  const seedBase = `${country}|${city}|${sector}`.toLowerCase();
  const parts = NAME_PARTS[sector];
  const tags = SECTOR_TAGS[sector];

  const results: BusinessSummary[] = [];
  for (let i = 0; i < count; i++) {
    const rand = seededRandom(`${seedBase}|${i}`);
    const prefix = pick(rand, parts.prefixes);
    const noun = pick(rand, parts.nouns);
    const name = `${prefix} ${noun}`;
    const streetNum = randInt(rand, 12, 480);
    const street = pick(rand, STREET_NAMES);
    const rating = randFloat(rand, 3.6, 4.9, 1);
    const reviewCount = randInt(rand, 40, 2400);
    const priceLevel = (randInt(rand, 1, 4) as 1 | 2 | 3 | 4);
    const businessTags = pickN(rand, tags, 3);
    const matchScore = Math.round(
      // Weighted so higher ratings + review volume + tag richness score higher — deterministic
      // ranking so the "5 best matching results" is stable and explainable.
      rating * 14 + Math.min(reviewCount, 1500) / 60 + businessTags.length * 2 + randInt(rand, 0, 6)
    );

    results.push({
      id: `${slugify(country)}-${slugify(city)}-${sector}-${slugify(name)}-${i}`,
      name,
      sector,
      country,
      city,
      address: `${streetNum} ${street}, ${city}, ${country}`,
      phone: `+${randInt(rand, 1, 99)} ${randInt(rand, 100, 999)} ${randInt(rand, 1000000, 9999999)}`,
      website: rand() > 0.35 ? `https://www.${slugify(name)}.example.com` : null,
      instagramHandle: `@${slugify(name).replace(/_/g, "")}`,
      rating,
      reviewCount,
      priceLevel,
      tags: businessTags,
      shortDescription: `${businessTags.join(", ")} — a well-reviewed ${sector} in ${city}.`,
      matchScore: Math.min(matchScore, 99)
    });
  }

  return results.sort((a, b) => b.matchScore - a.matchScore).slice(0, count);
}
