import { Job, StageKey } from "@/lib/types";
import { getBrandAssetProvider } from "@/lib/providers/instagram";
import { generateMockBusinesses } from "@/lib/mockData/businessGenerator";
import { getSectorTemplate } from "@/lib/templates/sectorTemplates";
import { renderSite } from "@/lib/templates/siteRenderer";
import { fillTemplate, titleCase } from "@/lib/util/text";
import { pick, pickN, seededRandom } from "@/lib/rng";

export interface StageResult {
  detail: string;
  logs: string[];
}

export type StageRunner = (job: Job) => Promise<StageResult>;

const OPEN_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// schema.org type per sector, used for the LocalBusiness JSON-LD block generated in the
// SEO & structured data stage.
const SCHEMA_ORG_TYPE: Record<string, string> = {
  cafe: "CafeOrCoffeeShop",
  restaurant: "Restaurant",
  gym: "SportsActivityLocation"
};

function buildOpeningHours(rand: () => number, sector: string): Record<string, string> {
  const weekdayOpen = sector === "gym" ? "06:00" : "08:00";
  const weekdayClose = sector === "gym" ? "22:00" : "20:00";
  const weekendOpen = sector === "gym" ? "07:00" : "09:00";
  const weekendClose = sector === "gym" ? "20:00" : "22:00";
  const closedSunday = sector !== "gym" && rand() > 0.7;

  const hours: Record<string, string> = {};
  for (const day of OPEN_DAYS) {
    if (day === "Sunday" && closedSunday) {
      hours[day] = "Closed";
    } else if (day === "Saturday" || day === "Sunday") {
      hours[day] = `${weekendOpen} – ${weekendClose}`;
    } else {
      hours[day] = `${weekdayOpen} – ${weekdayClose}`;
    }
  }
  return hours;
}

// --- 1. Intake & validation -------------------------------------------------

const intake: StageRunner = async (job) => {
  const b = job.business;
  const missing: string[] = [];
  if (!b.name) missing.push("name");
  if (!b.address) missing.push("address");
  if (!b.city || !b.country) missing.push("location");
  if (missing.length) {
    throw new Error(`Business profile is missing required fields: ${missing.join(", ")}`);
  }
  return {
    detail: `Validated profile for "${b.name}" (${b.sector}) in ${b.city}, ${b.country}.`,
    logs: [
      `Sector: ${b.sector}`,
      `Rating: ${b.rating.toFixed(1)} from ${b.reviewCount} reviews`,
      `Instagram handle: ${b.instagramHandle || "not provided"}`
    ]
  };
};

// --- 2. Business research ---------------------------------------------------

const research: StageRunner = async (job) => {
  const b = job.business;
  const rand = seededRandom(`${b.id}|research`);
  const template = getSectorTemplate(b.sector);
  const specialties = pickN(rand, template.serviceCatalog.map((s) => s.title.toLowerCase()), 3);
  const priceLabel = ["budget-friendly", "mid-range", "upscale", "premium"][b.priceLevel - 1];

  const sentiment =
    b.rating >= 4.6
      ? "Reviewers consistently praise the quality and consistency here — a standout in its category."
      : b.rating >= 4.0
      ? "Generally well-reviewed, with regulars calling out friendly staff and reliable quality."
      : "Mixed but mostly positive reviews, with room to highlight recent improvements.";

  job.research = {
    category: `${titleCase(b.sector)} · ${titleCase(b.tags[0] ?? b.sector)}`,
    openingHours: buildOpeningHours(rand, b.sector),
    priceRange: `${"$".repeat(b.priceLevel)} (${priceLabel})`,
    specialties,
    competitorNames: [],
    neighborhoodSummary: "",
    sentimentSummary: sentiment
  };

  return {
    detail: `Compiled a research profile: ${priceLabel} ${b.sector}, known for ${specialties.join(", ")}.`,
    logs: [
      `Price range: ${job.research.priceRange}`,
      `Specialties identified: ${specialties.join(", ")}`,
      `Sentiment: ${sentiment}`
    ]
  };
};

// --- 3. Local & competitive context -----------------------------------------

const localContext: StageRunner = async (job) => {
  const b = job.business;
  if (!job.research) throw new Error("Research stage must run before local context analysis.");

  const competitors = generateMockBusinesses({ country: b.country, city: b.city, sector: b.sector }, 6)
    .filter((c) => c.id !== b.id)
    .slice(0, 3)
    .map((c) => c.name);

  const rand = seededRandom(`${b.id}|local`);
  const positioning =
    b.matchScore >= 80
      ? `${b.name} ranks among the top-matching ${b.sector}s in ${b.city}, ahead of ${competitors[0] ?? "nearby alternatives"}.`
      : `${b.name} holds a solid position in ${b.city}'s ${b.sector} scene, competing closely with ${competitors[0] ?? "nearby alternatives"}.`;

  job.research.competitorNames = competitors;
  job.research.neighborhoodSummary = `${positioning} Nearby options include ${competitors.join(", ") || "a handful of local spots"}.`;

  return {
    detail: `Scanned ${competitors.length} nearby competitors and positioned ${b.name} within the local ${b.sector} landscape.`,
    logs: competitors.map((c, i) => `Competitor ${i + 1}: ${c}`)
  };
};

// --- 4. Brand assets (Instagram) --------------------------------------------

const brandAssets: StageRunner = async (job) => {
  const provider = getBrandAssetProvider();
  const assets = await provider.fetchAssets(job.business, 4);
  job.brandAssets = assets;
  const posts = assets.filter((a) => a.kind === "post");

  return {
    detail: `Pulled ${assets.length} brand images (profile + ${posts.length} posts) from ${job.business.instagramHandle || "Instagram"}.`,
    logs: posts.map((p) => `"${p.caption}" — ${p.likeCount} likes, dominant color ${p.dominantColor}`)
  };
};

// --- 5. Content strategy -----------------------------------------------------

const contentStrategy: StageRunner = async (job) => {
  const template = getSectorTemplate(job.business.sector);
  job.contentStrategy = {
    sections: template.sections,
    primaryCallToAction: template.primaryCallToAction,
    toneOfVoice: template.toneOfVoice
  };

  return {
    detail: `Planned a ${template.sections.length}-section site with a "${template.toneOfVoice}" tone.`,
    logs: [`Sections: ${template.sections.join(" → ")}`, `Primary CTA: ${template.primaryCallToAction}`]
  };
};

// --- 6. Copywriting -----------------------------------------------------------

const copywriting: StageRunner = async (job) => {
  const b = job.business;
  if (!job.research) throw new Error("Research must complete before copywriting.");
  const template = getSectorTemplate(b.sector);
  const rand = seededRandom(`${b.id}|copy`);

  const vars = {
    name: b.name,
    city: b.city,
    sector: b.sector,
    specialties: job.research.specialties.join(", ")
  };

  const services = template.serviceCatalog.slice(0, 5).map((s) => ({
    title: s.title,
    description: s.description
  }));

  const testimonials = pickN(rand, template.testimonialNames, 3).map((author) => ({
    author,
    quote: fillTemplate(pick(rand, template.testimonialQuoteTemplates), {
      ...vars,
      tag: pick(rand, b.tags.length ? b.tags : job.research!.specialties)
    })
  }));

  job.copy = {
    headline: fillTemplate(pick(rand, template.headlineTemplates), vars),
    subheadline: fillTemplate(pick(rand, template.subheadlineTemplates), vars),
    aboutParagraph: fillTemplate(pick(rand, template.aboutTemplates), vars),
    services,
    testimonials,
    ctaText: pick(rand, template.ctaTexts)
  };

  return {
    detail: `Wrote homepage copy: "${job.copy.headline}"`,
    logs: [`${services.length} services drafted`, `${testimonials.length} testimonials composed`]
  };
};

// --- 7. Template & palette selection ------------------------------------------

const templateSelection: StageRunner = async (job) => {
  const b = job.business;
  const template = getSectorTemplate(b.sector);
  const rand = seededRandom(`${b.id}|palette`);
  const palette = pick(rand, template.palettes);

  job.site = {
    templateId: template.templateId,
    palette,
    files: {},
    entryPoint: "index.html"
  };

  return {
    detail: `Selected template "${template.templateId}" with palette ${palette.primary} / ${palette.secondary}.`,
    logs: [`Sections rendered from content strategy: ${job.contentStrategy?.sections.join(", ") ?? "n/a"}`]
  };
};

// --- 8. SEO & structured data --------------------------------------------------

const seoMetadata: StageRunner = async (job) => {
  const b = job.business;
  if (!job.copy || !job.research) throw new Error("Copy and research must exist before SEO stage.");

  const keywords = [b.sector, b.city, b.country, ...job.research.specialties, ...b.tags];
  const title = `${b.name} — ${titleCase(b.sector)} in ${b.city}`;
  const description = `${job.copy.subheadline} ${job.research.sentimentSummary}`.slice(0, 155);

  job.seo = {
    title,
    description,
    keywords: Array.from(new Set(keywords.map((k) => k.toLowerCase()))),
    jsonLd: {
      "@context": "https://schema.org",
      "@type": SCHEMA_ORG_TYPE[b.sector],
      name: b.name,
      address: b.address,
      telephone: b.phone,
      url: b.website ?? undefined,
      priceRange: "$".repeat(b.priceLevel),
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: b.rating,
        reviewCount: b.reviewCount
      },
      openingHoursSpecification: Object.entries(job.research.openingHours).map(([day, hours]) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: day,
        opens: hours === "Closed" ? undefined : hours.split(" – ")[0],
        closes: hours === "Closed" ? undefined : hours.split(" – ")[1]
      }))
    }
  };

  return {
    detail: `Generated SEO title, meta description and LocalBusiness structured data (${job.seo.keywords.length} keywords).`,
    logs: [`Title: ${title}`, `Description: ${description}`]
  };
};

// --- 9. Page assembly -------------------------------------------------------

const pageAssembly: StageRunner = async (job) => {
  if (!job.research || !job.copy || !job.seo || !job.site) {
    throw new Error("Research, copy, SEO and template selection must all complete before page assembly.");
  }
  const template = getSectorTemplate(job.business.sector);

  const site = renderSite({
    business: job.business,
    research: job.research,
    brandAssets: job.brandAssets,
    copy: job.copy,
    seo: job.seo,
    template,
    palette: job.site.palette
  });

  job.site = site;

  const sizeKb = Math.round(
    Object.values(site.files).reduce((sum, content) => sum + content.length, 0) / 1024
  );

  return {
    detail: `Assembled ${Object.keys(site.files).length} files (${sizeKb} KB) for the demo site.`,
    logs: Object.keys(site.files).map((f) => `Generated ${f}`)
  };
};

// --- 10. Publish preview -----------------------------------------------------

const publish: StageRunner = async (job) => {
  if (!job.site) throw new Error("Nothing to publish — page assembly did not complete.");
  return {
    detail: `Demo site published for preview at /jobs/${job.id}/preview.`,
    logs: [`Entry point: ${job.site.entryPoint}`, `Template: ${job.site.templateId}`]
  };
};

export const STAGE_RUNNERS: Record<StageKey, StageRunner> = {
  intake,
  research,
  local_context: localContext,
  brand_assets: brandAssets,
  content_strategy: contentStrategy,
  copywriting,
  template_selection: templateSelection,
  seo_metadata: seoMetadata,
  page_assembly: pageAssembly,
  publish
};
