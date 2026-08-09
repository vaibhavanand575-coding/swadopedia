import { BrandAsset, BusinessSummary, CopyContent, GeneratedSite, ResearchNotes, SeoMeta } from "@/lib/types";
import { escapeHtml } from "@/lib/util/text";
import { SectorTemplate } from "@/lib/templates/sectorTemplates";

export interface RenderInput {
  business: BusinessSummary;
  research: ResearchNotes;
  brandAssets: BrandAsset[];
  copy: CopyContent;
  seo: SeoMeta;
  template: SectorTemplate;
  palette: { primary: string; secondary: string; text: string };
}

function renderGallery(assets: BrandAsset[]): string {
  const posts = assets.filter((a) => a.kind === "post");
  return posts
    .map(
      (a) => `
      <figure class="gallery-item">
        <img src="${a.url}" alt="${escapeHtml(a.caption)}" loading="lazy" />
        <figcaption>${escapeHtml(a.caption)} <span class="likes">♥ ${a.likeCount}</span></figcaption>
      </figure>`
    )
    .join("\n");
}

function renderServices(copy: CopyContent, sectionLabel: string): string {
  return `
  <section class="section" id="${sectionLabel.toLowerCase()}">
    <h2>${escapeHtml(sectionLabel)}</h2>
    <div class="grid">
      ${copy.services
        .map(
          (s) => `
        <div class="card-item">
          <h3>${escapeHtml(s.title)}</h3>
          <p>${escapeHtml(s.description)}</p>
        </div>`
        )
        .join("\n")}
    </div>
  </section>`;
}

function renderHours(hours: Record<string, string>): string {
  return Object.entries(hours)
    .map(([day, hrs]) => `<tr><td>${escapeHtml(day)}</td><td>${escapeHtml(hrs)}</td></tr>`)
    .join("\n");
}

function renderTestimonials(copy: CopyContent): string {
  return copy.testimonials
    .map(
      (t) => `
      <blockquote>
        <p>&ldquo;${escapeHtml(t.quote)}&rdquo;</p>
        <cite>— ${escapeHtml(t.author)}</cite>
      </blockquote>`
    )
    .join("\n");
}

export function renderSite(input: RenderInput): GeneratedSite {
  const { business, research, brandAssets, copy, seo, template, palette } = input;
  const profile = brandAssets.find((a) => a.kind === "profile");
  const menuLabel = business.sector === "gym" ? "Classes & Programs" : "Menu & Services";

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(seo.title)}</title>
  <meta name="description" content="${escapeHtml(seo.description)}" />
  <meta name="keywords" content="${escapeHtml(seo.keywords.join(", "))}" />
  <link rel="stylesheet" href="styles.css" />
  <script type="application/ld+json">${JSON.stringify(seo.jsonLd)}</script>
</head>
<body>
  <header class="site-header">
    <div class="wrap header-inner">
      <div class="brand">
        ${profile ? `<img class="brand-logo" src="${profile.url}" alt="${escapeHtml(business.name)} logo" />` : ""}
        <span class="brand-name">${escapeHtml(business.name)}</span>
      </div>
      <nav>
        <a href="#${menuLabel.toLowerCase().split(" ")[0]}">${escapeHtml(menuLabel.split(" ")[0])}</a>
        <a href="#gallery">Gallery</a>
        <a href="#hours">Hours</a>
        <a href="#contact">Contact</a>
      </nav>
    </div>
  </header>

  <section class="hero">
    <div class="wrap hero-inner">
      <h1>${escapeHtml(copy.headline)}</h1>
      <p class="subheadline">${escapeHtml(copy.subheadline)}</p>
      <a class="cta" href="#contact">${escapeHtml(copy.ctaText)}</a>
      <div class="hero-meta">
        <span>★ ${business.rating.toFixed(1)} (${business.reviewCount} reviews)</span>
        <span>${"$".repeat(business.priceLevel)}</span>
        <span>${escapeHtml(research.category)}</span>
      </div>
    </div>
  </section>

  <section class="section" id="about">
    <div class="wrap">
      <h2>About</h2>
      <p>${escapeHtml(copy.aboutParagraph)}</p>
      <p class="neighborhood">${escapeHtml(research.neighborhoodSummary)}</p>
    </div>
  </section>

  <div class="wrap">
    ${renderServices(copy, menuLabel)}
  </div>

  <section class="section alt" id="gallery">
    <div class="wrap">
      <h2>From Instagram — @${escapeHtml(business.instagramHandle.replace(/^@/, ""))}</h2>
      <div class="gallery">
        ${renderGallery(brandAssets)}
      </div>
    </div>
  </section>

  <section class="section" id="hours">
    <div class="wrap two-col">
      <div>
        <h2>Hours</h2>
        <table class="hours-table">
          <tbody>${renderHours(research.openingHours)}</tbody>
        </table>
      </div>
      <div>
        <h2>What people say</h2>
        <div class="testimonials">
          ${renderTestimonials(copy)}
        </div>
      </div>
    </div>
  </section>

  <footer class="section alt" id="contact">
    <div class="wrap two-col">
      <div>
        <h2>Visit us</h2>
        <p>${escapeHtml(business.address)}</p>
        <p>${escapeHtml(business.phone)}</p>
        ${business.website ? `<p><a href="${escapeHtml(business.website)}">${escapeHtml(business.website)}</a></p>` : ""}
        <p>Instagram: ${escapeHtml(business.instagramHandle)}</p>
      </div>
      <div class="map-placeholder" role="img" aria-label="Map location for ${escapeHtml(business.address)}">
        📍 ${escapeHtml(business.city)}, ${escapeHtml(business.country)}
      </div>
    </div>
    <p class="fine-print">Demo site generated by LocalSite Builder for ${escapeHtml(business.name)} — template
      "${escapeHtml(template.templateId)}". Not affiliated with the business.</p>
  </footer>
</body>
</html>`;

  const css = `
:root {
  --primary: ${palette.primary};
  --secondary: ${palette.secondary};
  --text: ${palette.text};
}
* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #1f2937;
  line-height: 1.6;
  background: #ffffff;
}
.wrap { max-width: 1080px; margin: 0 auto; padding: 0 24px; }
.site-header { border-bottom: 1px solid #eee; position: sticky; top: 0; background: #fff; z-index: 10; }
.header-inner { display: flex; align-items: center; justify-content: space-between; padding: 14px 24px; }
.brand { display: flex; align-items: center; gap: 10px; }
.brand-logo { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }
.brand-name { font-weight: 700; font-size: 1.1rem; }
nav a { margin-left: 20px; text-decoration: none; color: #374151; font-size: 0.92rem; font-weight: 500; }
nav a:hover { color: var(--primary); }
.hero {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: var(--text);
  padding: 96px 24px;
  text-align: center;
}
.hero h1 { font-size: 2.6rem; margin: 0 0 16px; }
.hero .subheadline { font-size: 1.15rem; max-width: 640px; margin: 0 auto 28px; opacity: 0.95; }
.cta {
  display: inline-block; background: #fff; color: var(--primary); font-weight: 700;
  padding: 12px 26px; border-radius: 999px; text-decoration: none; box-shadow: 0 4px 14px rgba(0,0,0,0.15);
}
.hero-meta { margin-top: 28px; display: flex; gap: 20px; justify-content: center; font-size: 0.9rem; opacity: 0.9; flex-wrap: wrap; }
.section { padding: 64px 0; }
.section.alt { background: #f9fafb; }
.section h2 { font-size: 1.7rem; margin-bottom: 18px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-top: 12px; }
.card-item { border: 1px solid #eee; border-radius: 14px; padding: 20px; }
.card-item h3 { margin: 0 0 8px; color: var(--primary); }
.gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 18px; }
.gallery-item img { width: 100%; border-radius: 14px; display: block; }
.gallery-item figcaption { font-size: 0.85rem; color: #6b7280; margin-top: 8px; }
.gallery-item .likes { float: right; }
.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
.hours-table td { padding: 4px 12px 4px 0; }
.hours-table td:first-child { font-weight: 600; }
blockquote { border-left: 3px solid var(--secondary); margin: 0 0 18px; padding-left: 16px; }
blockquote p { margin: 0 0 4px; font-style: italic; }
blockquote cite { font-size: 0.85rem; color: #6b7280; }
.map-placeholder {
  background: #eef2ff; border-radius: 14px; display: flex; align-items: center; justify-content: center;
  min-height: 160px; font-weight: 600; color: #4338ca;
}
.fine-print { max-width: 1080px; margin: 32px auto 0; padding: 0 24px; font-size: 0.75rem; color: #9ca3af; }
.neighborhood { color: #6b7280; }
@media (max-width: 720px) {
  .two-col { grid-template-columns: 1fr; }
  .hero h1 { font-size: 2rem; }
}
`;

  return {
    templateId: template.templateId,
    palette,
    files: { "index.html": html, "styles.css": css },
    entryPoint: "index.html"
  };
}
