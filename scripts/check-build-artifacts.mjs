import { readdir, readFile } from 'node:fs/promises';
import { resolve, dirname, sep } from 'node:path';
const root = process.cwd();
const excluded = ['.gstack', '.impeccable', 'data'].map(p => resolve(root, p) + sep);
let manifests = 0;
async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = resolve(directory, entry.name);
    if (entry.isDirectory()) await inspect(file);
    else if (entry.name.endsWith('.nft.json')) {
      manifests++;
      const manifest = JSON.parse(await readFile(file, 'utf8'));
      for (const item of manifest.files || []) {
        const path = resolve(dirname(file), item);
        if (excluded.some(prefix => path.startsWith(prefix)) || /(^|[/\\])\.env[^/\\]*$/.test(path))
          throw new Error('Sensitive local file referenced by production build trace.');
      }
    }
  }
}
await inspect('.security-build');
if (!manifests) throw new Error('No production traces found');
console.log(`${manifests} production trace manifests checked; no sensitive local paths.`);
