import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocalSite Builder — find a business, generate its demo website",
  description:
    "Search local businesses by country, city and sector, pick one, and watch a 10-stage pipeline research it and generate a demo website."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <header className="mb-8 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                ⚡
              </span>
              LocalSite&nbsp;Builder
            </a>
            <span className="text-xs font-medium text-slate-400">demo pipeline · mock data mode</span>
          </header>
          {children}
          <footer className="mt-16 border-t border-slate-200 pt-6 text-xs text-slate-400">
            Business discovery and Instagram imagery run on deterministic mock providers unless real API
            keys are configured — see README for wiring Google Places / Instagram Graph API.
          </footer>
        </div>
      </body>
    </html>
  );
}
