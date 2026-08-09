"use client";

import { useEffect, useRef, useState } from "react";
import { Job, StageStatus } from "@/lib/types";

const STATUS_STYLES: Record<StageStatus, string> = {
  pending: "border-slate-200 bg-white text-slate-400",
  running: "border-brand-300 bg-brand-50 text-brand-700",
  done: "border-emerald-200 bg-emerald-50 text-emerald-700",
  error: "border-red-200 bg-red-50 text-red-700"
};

const STATUS_ICON: Record<StageStatus, string> = {
  pending: "○",
  running: "◐",
  done: "✓",
  error: "✕"
};

export default function JobPage({ params }: { params: { id: string } }) {
  const [job, setJob] = useState<Job | null>(null);
  const [notFound, setNotFound] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(`/api/jobs/${params.id}`, { cache: "no-store" });
        if (res.status === 404) {
          if (!cancelled) setNotFound(true);
          return;
        }
        const data = await res.json();
        if (!cancelled) setJob(data.job as Job);
        if (!cancelled && (data.job.status === "completed" || data.job.status === "failed")) {
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {
        // transient — the next poll tick will retry
      }
    }

    poll();
    pollRef.current = setInterval(poll, 900);
    return () => {
      cancelled = true;
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [params.id]);

  if (notFound) {
    return (
      <div className="card p-6 text-sm text-slate-600">
        Job not found. It may have expired (this demo keeps jobs in memory only) — go back and
        <a href="/" className="text-brand-600"> start a new search</a>.
      </div>
    );
  }

  if (!job) {
    return <div className="text-sm text-slate-500">Loading job…</div>;
  }

  const doneCount = job.stages.filter((s) => s.status === "done").length;
  const percent = Math.round((doneCount / job.stages.length) * 100);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-slate-900">{job.business.name}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {job.business.address} · {job.business.sector}
        </p>
      </section>

      <section className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Pipeline progress
          </h2>
          <span className="text-sm font-medium text-slate-600">
            {doneCount}/{job.stages.length} stages · {percent}%
          </span>
        </div>
        <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-brand-600 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>

        <ol className="space-y-3">
          {job.stages.map((stage, i) => (
            <li
              key={stage.key}
              className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${STATUS_STYLES[stage.status]}`}
            >
              <span className="mt-0.5 text-base leading-none">{STATUS_ICON[stage.status]}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">
                    {i + 1}. {stage.title}
                  </span>
                  {stage.status === "running" && (
                    <span className="text-xs font-medium animate-pulse">running…</span>
                  )}
                </div>
                {stage.detail && <p className="mt-1 text-sm">{stage.detail}</p>}
                {stage.logs.length > 0 && (
                  <ul className="mt-1.5 space-y-0.5 text-xs opacity-80">
                    {stage.logs.map((log, li) => (
                      <li key={li}>· {log}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>

        {job.status === "failed" && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Pipeline failed: {job.error}
          </div>
        )}
      </section>

      {job.status === "completed" && job.site && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Generated demo website
            </h2>
            <div className="flex gap-2">
              <a
                className="btn-secondary"
                href={`/api/jobs/${job.id}/site/index.html`}
                target="_blank"
                rel="noreferrer"
              >
                Open in new tab
              </a>
              <a className="btn-primary" href={`/api/jobs/${job.id}/download`}>
                Download ZIP
              </a>
            </div>
          </div>
          <div className="card overflow-hidden">
            <iframe
              title="Generated site preview"
              src={`/api/jobs/${job.id}/site/index.html`}
              className="h-[720px] w-full"
            />
          </div>
        </section>
      )}
    </div>
  );
}
