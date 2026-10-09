import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const { version } = JSON.parse(await readFile('package.json', 'utf8'));
const tag = process.env.RELEASE_TAG;
assert.match(tag || '', /^v\d+\.\d+\.\d+$/, 'Release a tag such as v1.20.0');
assert.equal(tag, `v${version}`, 'Release tag must match package.json');
const changelog = await readFile('CHANGELOG.md', 'utf8');
const heading = changelog.split(/\r?\n/).find(line => line.startsWith(`## [${version}]`)) || '';
assert.match(heading, /^## \[\d+\.\d+\.\d+\] - \d{4}-\d{2}-\d{2}$/, 'Finalize this version\'s changelog heading with a release date (YYYY-MM-DD) before publishing');
console.log(`Release tag and notes match version ${version}.`);
