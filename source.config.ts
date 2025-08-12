import { defineDocs, defineConfig } from 'fumadocs-mdx/config';

export const { docs, meta } = defineDocs({
  dir: 'content/docs',
});

export const { docs: projectDocs, meta: projectMeta } = defineDocs({
  dir: 'content/project-management',
});

// News docs live under content/news/YYYY-MM-DD.mdx
export const { docs: newsDocs, meta: newsMeta } = defineDocs({
  dir: 'content/news',
});

export default defineConfig();
