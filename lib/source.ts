import { docs, meta, projectDocs, projectMeta, newsDocs, newsMeta } from '@/.source';
import { createMDXSource } from 'fumadocs-mdx';
import { loader } from 'fumadocs-core/source';

export const source = loader({
  baseUrl: '/docs',
  source: createMDXSource(docs, meta),
});

export const projectSource = loader({
  baseUrl: '/project-management',
  source: createMDXSource(projectDocs, projectMeta),
});

export const newsSource = loader({
  baseUrl: '/news',
  source: createMDXSource(newsDocs, newsMeta),
});
