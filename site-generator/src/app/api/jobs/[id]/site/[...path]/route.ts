import { NextResponse } from "next/server";
import { getJob } from "@/lib/store";

const CONTENT_TYPES: Record<string, string> = {
  html: "text/html; charset=utf-8",
  css: "text/css; charset=utf-8",
  js: "text/javascript; charset=utf-8",
  json: "application/json; charset=utf-8"
};

export async function GET(_request: Request, { params }: { params: { id: string; path?: string[] } }) {
  const job = getJob(params.id);
  if (!job || !job.site) {
    return NextResponse.json({ error: "Generated site not available yet." }, { status: 404 });
  }

  const requestedPath = params.path && params.path.length > 0 ? params.path.join("/") : job.site.entryPoint;
  const content = job.site.files[requestedPath];
  if (content === undefined) {
    return NextResponse.json({ error: `File "${requestedPath}" not found in generated site.` }, { status: 404 });
  }

  const ext = requestedPath.split(".").pop() ?? "";
  const contentType = CONTENT_TYPES[ext] ?? "text/plain; charset=utf-8";

  return new NextResponse(content, { headers: { "Content-Type": contentType } });
}
