const PALETTES: Array<[string, string]> = [
  ['#c98a1b', '#8f5f0f'],
  ['#33507a', '#1f3350'],
  ['#a9603a', '#7a3f22'],
  ['#4c7a5e', '#2f5240'],
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function initials(label: string): string {
  const words = label.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

// Deterministic, offline SVG placeholder — used when a remote image URL fails to load.
export function placeholderDataUrl(seed: string, label: string): string {
  const [from, to] = PALETTES[hashString(seed) % PALETTES.length];
  const text = initials(label);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${from}"/>
        <stop offset="1" stop-color="${to}"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#g)"/>
    <text x="200" y="165" font-family="Georgia, serif" font-size="72" font-weight="700" fill="#efede3" fill-opacity="0.9" text-anchor="middle" dominant-baseline="middle">${text}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
