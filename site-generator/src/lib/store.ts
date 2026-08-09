import { BusinessSummary, Job, StageKey, StageState } from "@/lib/types";
import { randomUUID } from "crypto";

// In-memory job store. Good enough for a single-process local/demo deployment — the pipeline
// runs entirely in the Next.js server process. Swap this for a real database (Postgres/Redis)
// if you need multi-instance deployment or persistence across restarts.
//
// Stored on `globalThis` so the Map survives Next.js dev-server hot module reloads.

declare global {
  // eslint-disable-next-line no-var
  var __jobStore: Map<string, Job> | undefined;
}

const store: Map<string, Job> = globalThis.__jobStore ?? new Map();
globalThis.__jobStore = store;

export const STAGE_DEFINITIONS: { key: StageKey; title: string }[] = [
  { key: "intake", title: "Intake & validation" },
  { key: "research", title: "Business research" },
  { key: "local_context", title: "Local & competitive context" },
  { key: "brand_assets", title: "Pulling brand imagery from Instagram" },
  { key: "content_strategy", title: "Content strategy" },
  { key: "copywriting", title: "Copywriting" },
  { key: "template_selection", title: "Template & palette selection" },
  { key: "seo_metadata", title: "SEO & structured data" },
  { key: "page_assembly", title: "Page assembly" },
  { key: "publish", title: "Publish preview" }
];

function initialStages(): StageState[] {
  return STAGE_DEFINITIONS.map((s) => ({
    key: s.key,
    title: s.title,
    status: "pending",
    detail: null,
    startedAt: null,
    finishedAt: null,
    logs: []
  }));
}

export function createJob(business: BusinessSummary): Job {
  const now = new Date().toISOString();
  const job: Job = {
    id: randomUUID(),
    business,
    status: "queued",
    createdAt: now,
    updatedAt: now,
    stages: initialStages(),
    research: null,
    brandAssets: [],
    contentStrategy: null,
    copy: null,
    seo: null,
    site: null,
    error: null
  };
  store.set(job.id, job);
  return job;
}

export function getJob(id: string): Job | undefined {
  return store.get(id);
}

export function saveJob(job: Job): void {
  job.updatedAt = new Date().toISOString();
  store.set(job.id, job);
}

export function updateJob(id: string, mutate: (job: Job) => void): Job | undefined {
  const job = store.get(id);
  if (!job) return undefined;
  mutate(job);
  saveJob(job);
  return job;
}
