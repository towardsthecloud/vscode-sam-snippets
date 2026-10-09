import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const entry = resolve('scripts/check-release.mjs');
for (const { name, heading, tag = 'v1.20.0', accepted } of [
  { name: 'accepts matching tag and dated release notes', heading: '## [1.20.0] - 2026-10-09', accepted: true },
  { name: 'rejects unreleased notes', heading: '## [1.20.0] - Unreleased', accepted: false },
  { name: 'rejects notes for a different version', heading: '## [1.19.0] - 2026-08-01', accepted: false },
  { name: 'rejects a tag that differs from the package version', heading: '## [1.20.0] - 2026-10-09', tag: 'v1.19.0', accepted: false },
]) {
  test(name, async () => {
    const directory = await mkdtemp(resolve(tmpdir(), 'sam-release-'));
    try {
      await writeFile(resolve(directory, 'package.json'), JSON.stringify({ version: '1.20.0' }));
      await writeFile(resolve(directory, 'CHANGELOG.md'), '# Changelog\n\n' + heading + '\n\n- Changes.\n');
      const result = spawnSync(process.execPath, [entry], {
        cwd: directory, encoding: 'utf8', env: { ...process.env, RELEASE_TAG: tag },
      });
      assert.ifError(result.error);
      if (accepted) assert.equal(result.status, 0, result.stderr);
      else assert.notEqual(result.status, 0, 'Release guard must reject this input');
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
}
