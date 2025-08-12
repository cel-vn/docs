#!/usr/bin/env ts-node
/**
 * Fetch daily tech news and write to content/news/YYYY-MM-DD.mdx
 * Uses public RSS/JSON sources without secrets. Intended for local/dev.
 */
import fs from 'node:fs';
import path from 'node:path';

// Minimal fetch wrapper using global fetch (Node 18+)
async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { headers: { 'User-Agent': 'cel-docs-news-script' } });
  if (!res.ok) throw new Error(`Request failed ${res.status} ${url}`);
  return res.json() as Promise<T>;
}

// Sources: Hacker News Algolia API (top stories by points in last 24h)
// and dev.to latest articles (JSON)
async function fetchHackerNews(): Promise<{ title: string; url: string }[]> {
  const data = await getJSON<{ hits: { title: string; url: string | null }[] }>(
    'https://hn.algolia.com/api/v1/search?tags=story&numericFilters=points>100,created_at_i>=' +
      Math.floor(Date.now() / 1000 - 60 * 60 * 24)
  );
  return data.hits
    .filter((h) => h.title && h.url)
    .slice(0, 8)
    .map((h) => ({ title: h.title, url: h.url! }));
}

async function fetchDevTo(): Promise<{ title: string; url: string }[]> {
  const data = await getJSON<{ title: string; url: string }[]>(
    'https://dev.to/api/articles?per_page=8'
  );
  return data.map((a) => ({ title: a.title, url: a.url }));
}

function mdxEscape(text: string) {
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildMDX(dateISO: string, sections: Record<string, { title: string; url: string }[]>) {
  const dateNice = dateISO;
  const lines: string[] = [];
  lines.push('---');
  lines.push(`title: Tech News ${dateNice}`);
  lines.push(`description: Daily technology, coding, and industry updates for ${dateNice}.`);
  lines.push('---');
  lines.push('');
  lines.push('# Daily Tech News');
  lines.push('');
  for (const [section, items] of Object.entries(sections)) {
    lines.push(`## ${section}`);
    lines.push('');
    if (items.length === 0) {
      lines.push('_No items today._');
    } else {
      for (const it of items) {
        lines.push(`- [${mdxEscape(it.title)}](${it.url})`);
      }
    }
    lines.push('');
  }
  lines.push('---');
  lines.push('Generated automatically. Sources: Hacker News, dev.to');
  lines.push('');
  return lines.join('\n');
}

async function main() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const dateFolder = path.join(process.cwd(), 'content', 'news');
  const fileName = `${yyyy}-${mm}-${dd}.mdx`;
  const filePath = path.join(dateFolder, fileName);

  const [hn, devto] = await Promise.allSettled([fetchHackerNews(), fetchDevTo()]);

  const sections: Record<string, { title: string; url: string }[]> = {
    'Hacker News (last 24h, >100 pts)': hn.status === 'fulfilled' ? hn.value : [],
    'DEV Community (latest)': devto.status === 'fulfilled' ? devto.value : [],
  };

  const content = buildMDX(`${yyyy}-${mm}-${dd}`, sections);

  await fs.promises.mkdir(dateFolder, { recursive: true });
  await fs.promises.writeFile(filePath, content, 'utf8');

  // Print relative path for logging
  console.log(`Wrote ${path.relative(process.cwd(), filePath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
