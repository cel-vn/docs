import { defineDocs, defineConfig } from 'fumadocs-mdx/config';

export const { docs, meta } = defineDocs({
  dir: 'content/docs',
});

export const { docs: projectDocs, meta: projectMeta } = defineDocs({
  dir: 'content/project-management',
});

export default defineConfig();
