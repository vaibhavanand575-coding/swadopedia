import { NextResponse } from "next/server";
import archiver from "archiver";
import { getJob } from "@/lib/store";

export const runtime = "nodejs";

function buildZip(files: Record<string, string>): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const archive = archiver("zip", { zlib: { level: 9 } });
    const chunks: Buffer[] = [];

    archive.on("data", (chunk: Buffer) => chunks.push(chunk));
    archive.on("error", reject);
    archive.on("end", () => resolve(Buffer.concat(chunks)));

    for (const [path, content] of Object.entries(files)) {
      archive.append(content, { name: path });
    }
    void archive.finalize();
  });
}

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const job = getJob(params.id);
  if (!job || !job.site) {
    return NextResponse.json({ error: "Generated site not available yet." }, { status: 404 });
  }

  const zip = await buildZip(job.site.files);
  const filename = `${job.business.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-demo-site.zip`;

  return new NextResponse(new Uint8Array(zip), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${filename}"`
    }
  });
}
