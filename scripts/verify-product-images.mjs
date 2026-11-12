/** Verify the shipped manifest and every referenced image, without network requests. */
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const manifest = JSON.parse(await fs.readFile(path.join(root, 'config/product-images.json'), 'utf8'));
const missing = JSON.parse(await fs.readFile(path.join(root, 'docs/product-images-missing.json'), 'utf8'));
const exclusions = JSON.parse(await fs.readFile(path.join(root, 'config/product-image-exclusions.json'), 'utf8'));
const files = new Set();
for (const [id, image] of Object.entries(manifest)) {
  assert.match(id, /^\d+$/);
  assert.ok(image.name && image.provider && image.sourcePage && image.sourceImage);
  assert.match(image.src, /^\/images\/products\/[a-f0-9]{24}\.webp$/);
  assert.equal(new URL(image.sourcePage).protocol, 'https:');
  assert.ok(!/X-Amz-Signature|X-Amz-Credential|X-Amz-Security-Token/i.test(image.sourceImage));
  assert.ok(!exclusions[image.sourceImage], `Excluded image remains on ${id}`);
  assert.ok(!missing.some(product => String(product.id) === id), `${id} is both covered and missing`);
  if (files.has(image.src)) continue;
  files.add(image.src);
  const file = path.join(root, 'public', image.src);
  const metadata = await sharp(file).metadata();
  assert.equal(metadata.format, 'webp');
  assert.ok(metadata.width >= 80 && metadata.height >= 80);
  assert.ok(metadata.width <= 1200 && metadata.height <= 1200);
  // Decode the entire file, not just its header, to detect truncated downloads.
  await sharp(file).stats();
}
console.log(`PASS ${Object.keys(manifest).length} product mappings, ${files.size} decoded photographs; ${missing.length} explicitly missing.`);
