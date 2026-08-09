import { Sector } from "@/lib/types";

export interface SectorTemplate {
  templateId: string;
  sections: string[];
  toneOfVoice: string;
  primaryCallToAction: string;
  headlineTemplates: string[];
  subheadlineTemplates: string[];
  aboutTemplates: string[];
  serviceCatalog: { title: string; description: string }[];
  testimonialNames: string[];
  testimonialQuoteTemplates: string[];
  ctaTexts: string[];
  palettes: { primary: string; secondary: string; text: string }[];
}

export const SECTOR_TEMPLATES: Record<Sector, SectorTemplate> = {
  cafe: {
    templateId: "cafe-warm-01",
    sections: ["hero", "about", "menu", "gallery", "hours", "testimonials", "contact"],
    toneOfVoice: "warm, inviting, community-first",
    primaryCallToAction: "See today's menu",
    headlineTemplates: [
      "{name} — your neighbourhood coffee ritual",
      "Slow coffee, made right, at {name}",
      "{name}: where {city} starts its mornings"
    ],
    subheadlineTemplates: [
      "Small-batch roasts, fresh pastries, and a seat that's always warm.",
      "A cozy corner of {city} for great coffee and better conversation.",
      "Ethically sourced beans, brewed with care, served with a smile."
    ],
    aboutTemplates: [
      "{name} has been pouring {specialties} for the {city} community, one cup at a time. We believe a great coffee shop is part kitchen, part living room — a place to slow down.",
      "Founded on a simple idea — {specialties} shouldn't be complicated — {name} keeps things honest: quality beans, careful brewing, and a space that feels like home."
    ],
    serviceCatalog: [
      { title: "Specialty espresso", description: "Single-origin shots pulled fresh throughout the day." },
      { title: "Pour-over bar", description: "Slow-brewed, hand-poured coffee for the purists." },
      { title: "Fresh bakes", description: "Pastries and light bites baked in-house every morning." },
      { title: "Private events", description: "Book the space for small gatherings and tastings." },
      { title: "Coffee subscriptions", description: "Take our beans home with a monthly subscription." }
    ],
    testimonialNames: ["Priya", "Daniel", "Amara", "Leo", "Hana", "Marco"],
    testimonialQuoteTemplates: [
      "My daily stop — the {tag} is unreal and the staff remember my order.",
      "Best {sector} in {city}, hands down. The {tag} keeps me coming back.",
      "Cozy, consistent, and the coffee is genuinely excellent."
    ],
    ctaTexts: ["Order ahead", "View our menu", "Visit us today"],
    palettes: [
      { primary: "#6f4e37", secondary: "#c8a27a", text: "#2b1d13" },
      { primary: "#3e2c23", secondary: "#e6ccb2", text: "#241a12" },
      { primary: "#5c4033", secondary: "#b08968", text: "#26170f" }
    ]
  },
  restaurant: {
    templateId: "restaurant-classic-01",
    sections: ["hero", "about", "menu", "gallery", "hours", "testimonials", "contact"],
    toneOfVoice: "confident, appetite-driven, hospitable",
    primaryCallToAction: "Reserve a table",
    headlineTemplates: [
      "{name} — a taste of {city}, done right",
      "Come hungry to {name}",
      "{name}: unforgettable meals in {city}"
    ],
    subheadlineTemplates: [
      "Seasonal menus, generous portions, and a room that feels like an occasion.",
      "Locally sourced ingredients, chef-led plates, every night of the week.",
      "A neighbourhood favourite for {specialties}."
    ],
    aboutTemplates: [
      "{name} brings {specialties} to the heart of {city}. Every plate starts with ingredients sourced from local partners and finishes with a lot of care in the kitchen.",
      "What started as a love for {specialties} became {name} — a table where {city} gathers for food worth talking about."
    ],
    serviceCatalog: [
      { title: "Dinner service", description: "A full seasonal menu served nightly." },
      { title: "Private dining", description: "Book our private room for celebrations and events." },
      { title: "Chef's tasting menu", description: "A curated multi-course journey through our kitchen." },
      { title: "Catering", description: "Bring our menu to your next event." },
      { title: "Weekend brunch", description: "A relaxed weekend menu with all the classics." }
    ],
    testimonialNames: ["Elena", "James", "Fatima", "Noah", "Chiara", "Rahul"],
    testimonialQuoteTemplates: [
      "The {tag} alone is worth the trip. One of the best meals we've had in {city}.",
      "Service was warm, the {tag} was outstanding — we're already planning our next visit.",
      "Consistently excellent. {name} never misses."
    ],
    ctaTexts: ["Book a table", "View our menu", "Plan your visit"],
    palettes: [
      { primary: "#7a1f1f", secondary: "#d4a017", text: "#2a0f0f" },
      { primary: "#2f3e2f", secondary: "#c9a66b", text: "#141c14" },
      { primary: "#4a1c1c", secondary: "#e0b34a", text: "#210c0c" }
    ]
  },
  gym: {
    templateId: "gym-bold-01",
    sections: ["hero", "about", "classes", "gallery", "hours", "testimonials", "contact"],
    toneOfVoice: "high-energy, motivational, no-nonsense",
    primaryCallToAction: "Book a free trial class",
    headlineTemplates: [
      "{name} — train harder, live stronger",
      "Your transformation starts at {name}",
      "{name}: {city}'s home for real results"
    ],
    subheadlineTemplates: [
      "Expert coaching, a community that pushes you, and results you can measure.",
      "Strength training, group classes, and recovery — all under one roof in {city}.",
      "Built for {specialties}. Built for you."
    ],
    aboutTemplates: [
      "{name} was built for people serious about {specialties}. Our coaches design every session around real progress — not just a workout, a plan.",
      "We started {name} to bring {specialties} to {city} without the ego. Just great coaching, a strong community, and results."
    ],
    serviceCatalog: [
      { title: "Personal training", description: "1-on-1 coaching tailored to your goals." },
      { title: "Group classes", description: "High-energy sessions that keep you accountable." },
      { title: "Strength programming", description: "Structured progressive programs for serious lifters." },
      { title: "Nutrition coaching", description: "Guidance to match your training with your goals." },
      { title: "Open gym access", description: "24/7 access to our full equipment floor." }
    ],
    testimonialNames: ["Marcus", "Ingrid", "Tomás", "Aisha", "Sven", "Priya"],
    testimonialQuoteTemplates: [
      "Hit a new PR thanks to the {tag} program — best coaching I've had in {city}.",
      "The {tag} classes changed how I train. Real community, real results.",
      "Six months in and I'm stronger than I've ever been."
    ],
    ctaTexts: ["Start your free trial", "Book a class", "Join now"],
    palettes: [
      { primary: "#111827", secondary: "#f97316", text: "#f9fafb" },
      { primary: "#0f172a", secondary: "#22d3ee", text: "#f8fafc" },
      { primary: "#1c1917", secondary: "#ef4444", text: "#fafaf9" }
    ]
  }
};

export function getSectorTemplate(sector: Sector): SectorTemplate {
  return SECTOR_TEMPLATES[sector];
}
