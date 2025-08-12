import { redirect } from 'next/navigation';
import fs from 'node:fs';
import path from 'node:path';

export default async function NewsIndex() {
  // Find the latest news file and redirect to it
  const dir = path.join(process.cwd(), 'content', 'news');
  let latest: string | null = null;
  try {
    const files = await fs.promises.readdir(dir);
    const mdx = files.filter((f) => /\d{4}-\d{2}-\d{2}\.mdx$/.test(f)).sort();
    latest = mdx.at(-1) ?? null;
  } catch {}

  if (latest) {
    redirect(`/news/${latest.replace(/\.mdx$/, '')}`);
  }

  // Fallback if no files
  redirect('/');
}
