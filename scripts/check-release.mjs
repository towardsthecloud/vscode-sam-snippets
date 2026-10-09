import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const { version } = JSON.parse(await readFile('package.json', 'utf8'));
const tag = process.env.RELEASE_TAG;
assert.match(tag || '', /^v\d+\.\d+\.\d+$/, 'Release a tag such as v1.20.0');
assert.equal(tag, `v${version}`, 'Release tag must match package.json');
const changelog = await readFile('CHANGELOG.md', 'utf8');
assert.ok(changelog.includes(`## [${version}]`), 'Add release notes for this version');
console.log(`Release tag and notes match version ${version}.`);
