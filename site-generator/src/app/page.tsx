"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BusinessSummary, SECTORS, Sector } from "@/lib/types";

export default function HomePage() {
  const router = useRouter();
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [sector, setSector] = useState<Sector>("cafe");

  const [results, setResults] = useState<BusinessSummary[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [selectingId, setSelectingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResults(null);
    setSearching(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country, city, sector })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Search failed.");
      setResults(data.results as BusinessSummary[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSearching(false);
    }
  }

  async function handleSelect(business: BusinessSummary) {
    setError(null);
    setSelectingId(business.id);
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not start the pipeline.");
      router.push(`/jobs/${data.job.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSelectingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Find a local business, generate its demo website
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Enter a country, city and sector to see the 5 best-matching businesses. Pick one and a
          10-stage pipeline researches it, pulls brand imagery, and builds a demo site.
        </p>
      </section>

      <form onSubmit={handleSearch} className="card grid gap-4 p-5 sm:grid-cols-4">
        <div>
          <label className="label" htmlFor="country">Country</label>
          <input
            id="country"
            className="input"
            placeholder="e.g. India"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="city">City</label>
          <input
            id="city"
            className="input"
            placeholder="e.g. Bengaluru"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="sector">Sector</label>
          <select
            id="sector"
            className="input"
            value={sector}
            onChange={(e) => setSector(e.target.value as Sector)}
          >
            {SECTORS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button type="submit" className="btn-primary w-full" disabled={searching}>
            {searching ? "Searching…" : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {results && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Top {results.length} matches in {city}, {country}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {results.map((b) => (
              <div key={b.id} className="card flex flex-col justify-between p-5">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-semibold text-slate-900">{b.name}</h3>
                    <span className="whitespace-nowrap rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                      {b.matchScore}% match
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{b.address}</p>
                  <p className="mt-2 text-sm text-slate-600">{b.shortDescription}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span>★ {b.rating.toFixed(1)} ({b.reviewCount})</span>
                    <span>{"$".repeat(b.priceLevel)}</span>
                    <span>{b.instagramHandle}</span>
                  </div>
                </div>
                <button
                  className="btn-primary mt-4"
                  onClick={() => handleSelect(b)}
                  disabled={selectingId !== null}
                >
                  {selectingId === b.id ? "Starting pipeline…" : "Generate demo website"}
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
