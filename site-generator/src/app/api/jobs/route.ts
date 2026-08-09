import { NextResponse } from "next/server";
import { createJob } from "@/lib/store";
import { runPipeline } from "@/lib/pipeline/engine";
import { BusinessSummary } from "@/lib/types";

export async function POST(request: Request) {
  let body: { business?: BusinessSummary };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const business = body.business;
  if (!business || !business.id || !business.name) {
    return NextResponse.json({ error: "A full `business` object (from /api/search) is required." }, {
      status: 400
    });
  }

  const job = createJob(business);

  // Fire-and-forget: the pipeline runs in the background and the client polls
  // GET /api/jobs/:id for progress. Errors are captured on the job itself, never thrown here.
  void runPipeline(job.id);

  return NextResponse.json({ job }, { status: 201 });
}
