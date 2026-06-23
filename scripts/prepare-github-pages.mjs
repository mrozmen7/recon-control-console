import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const outputDir = join(process.cwd(), 'dist', 'recon-control-console', 'browser');
const indexPath = join(outputDir, 'index.html');
const fallbackPath = join(outputDir, '404.html');
const baseHref = '/recon-control-console/';

const indexHtml = readFileSync(indexPath, 'utf8');
const patchedHtml = indexHtml.replace(/<base href="[^"]*">/, `<base href="${baseHref}">`);

if (!patchedHtml.includes(`<base href="${baseHref}">`)) {
  throw new Error(`Could not set GitHub Pages base href to ${baseHref}`);
}

writeFileSync(indexPath, patchedHtml);
writeFileSync(fallbackPath, patchedHtml);

console.log(`Prepared GitHub Pages build with base href ${baseHref}`);
