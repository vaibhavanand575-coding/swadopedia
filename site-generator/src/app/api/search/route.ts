import { NextResponse } from "next/server";
import { getBusinessSearchProvider } from "@/lib/providers/businessSearch";
import { SECTORS, Sector } from "@/lib/types";

export async function POST(request: Request) {
  let body: { country?: string; city?: string; sector?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const country = body.country?.trim();
  const city = body.city?.trim();
  const sector = body.sector?.trim() as Sector | undefined;

  if (!country || !city || !sector) {
    return NextResponse.json({ error: "country, city and sector are all required." }, { status: 400 });
  }
  if (!SECTORS.some((s) => s.value === sector)) {
    return NextResponse.json(
      { error: `Unsupported sector "${sector}". Choose one of: ${SECTORS.map((s) => s.value).join(", ")}.` },
      { status: 400 }
    );
  }

  const provider = getBusinessSearchProvider();
  const results = await provider.search({ country, city, sector }, 5);

  return NextResponse.json({ results });
}
