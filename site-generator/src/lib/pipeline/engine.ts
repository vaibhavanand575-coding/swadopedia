import { Job } from "@/lib/types";
import { getJob, saveJob, STAGE_DEFINITIONS } from "@/lib/store";
import { STAGE_RUNNERS } from "@/lib/pipeline/stages";

// A small artificial delay per stage so the UI can visibly show progress through all 10 stages
// instead of the (genuinely fast) pipeline finishing instantly. Tune/remove for a real deployment.
const STAGE_MIN_DELAY_MS = 350;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Runs all 10 pipeline stages for a job in order, persisting stage-by-stage progress to the job
 * store so the frontend can poll and render a live progress view. Safe to call fire-and-forget —
 * it never throws; failures are recorded on the job itself.
 */
export async function runPipeline(jobId: string): Promise<void> {
  const job = getJob(jobId);
  if (!job) return;

  job.status = "running";
  saveJob(job);

  for (let i = 0; i < STAGE_DEFINITIONS.length; i++) {
    const def = STAGE_DEFINITIONS[i];
    const current = getJob(jobId);
    if (!current) return;

    const stage = current.stages[i];
    stage.status = "running";
    stage.startedAt = new Date().toISOString();
    saveJob(current);

    const startedAt = Date.now();
    try {
      const runner = STAGE_RUNNERS[def.key];
      const result = await runner(current);
      const elapsed = Date.now() - startedAt;
      if (elapsed < STAGE_MIN_DELAY_MS) await sleep(STAGE_MIN_DELAY_MS - elapsed);

      stage.status = "done";
      stage.detail = result.detail;
      stage.logs = result.logs;
      stage.finishedAt = new Date().toISOString();
      saveJob(current);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      stage.status = "error";
      stage.detail = message;
      stage.finishedAt = new Date().toISOString();
      current.status = "failed";
      current.error = message;
      saveJob(current);
      return;
    }
  }

  const finished = getJob(jobId);
  if (finished) {
    finished.status = "completed";
    saveJob(finished);
  }
}

export function getProgress(job: Job): { completed: number; total: number; percent: number } {
  const total = job.stages.length;
  const completed = job.stages.filter((s) => s.status === "done").length;
  return { completed, total, percent: Math.round((completed / total) * 100) };
}
