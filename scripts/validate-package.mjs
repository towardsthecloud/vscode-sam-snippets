import assert from 'node:assert/strict';
import { readFile, mkdir, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

const vsix = '.test-artifacts/sam-snippets.vsix';
function unzip(args) {
  const result = spawnSync('unzip', args, { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || 'unzip failed');
  return result.stdout;
}
const files = unzip(['-Z1', vsix]).trim().split('\n').filter(file => !file.endsWith('/'));
const manifest = JSON.parse(unzip(['-p', vsix, 'extension/package.json']));
const allowed = new Set([
  '[Content_Types].xml', 'extension.vsixmanifest', 'extension/package.json',
  'extension/LICENSE.txt', 'extension/readme.md', 'extension/changelog.md',
  'extension/' + manifest.icon,
  ...manifest.contributes.snippets.map(item => 'extension/' + item.path.replace(/^\.\//, '')),
]);
assert.deepEqual(files.filter(file => !allowed.has(file)), [], 'VSIX includes development files');
for (const file of allowed) assert.ok(files.includes(file), `VSIX is missing ${file}`);
for (const contribution of manifest.contributes.snippets) {
  const file = contribution.path.replace(/^\.\//, '');
  assert.equal(unzip(['-p', vsix, 'extension/' + file]), await readFile(file, 'utf8'), `${file} differs from source`);
}
assert.ok(!manifest.main && !manifest.browser, 'The extension must remain snippets-only');
const extraction = '.test-artifacts/packaged';
await rm(extraction, { recursive: true, force: true });
await mkdir(extraction, { recursive: true });
unzip(['-q', vsix, '-d', extraction]);
console.log(`Verified ${files.length} packaged files; all declared snippets match their sources.`);
