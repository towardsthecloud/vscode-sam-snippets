import { cp, mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { runTests } from '@vscode/test-electron';

await mkdir('.test-artifacts', { recursive: true });
for (const path of ['editor-report.json', 'expanded-snippets.json', 'editor-logs']) {
  await rm(resolve('.test-artifacts', path), { recursive: true, force: true });
}
const profile = await mkdtemp(resolve(tmpdir(), 'sam-editor-'));
try {
  await mkdir(resolve(profile, 'workspace/.vscode'), { recursive: true });
  await writeFile(resolve(profile, 'workspace/.vscode/settings.json'), JSON.stringify({
    'workbench.startupEditor': 'none', 'chat.disableAIFeatures': true,
    'editor.snippetSuggestions': 'top', 'telemetry.telemetryLevel': 'off',
  }));
  await runTests({
    version: process.env.VSCODE_TEST_VERSION || 'stable',
    extensionDevelopmentPath: resolve('.test-artifacts/packaged/extension'),
    extensionTestsPath: resolve('test/editor/index.cjs'),
    extensionTestsEnv: {
      SAM_TEST_ARTIFACTS: resolve('.test-artifacts'),
      SAM_TEST_SCHEMA: resolve('data/sam-resources.json'),
    },
    launchArgs: [
      resolve(profile, 'workspace'),
      '--disable-extensions', '--disable-workspace-trust', '--skip-welcome',
      '--skip-release-notes', '--disable-gpu',
      '--user-data-dir=' + resolve(profile, 'user'),
      '--extensions-dir=' + resolve(profile, 'extensions'),
    ],
  });
} finally {
  try {
    await cp(resolve(profile, 'user/logs'), resolve('.test-artifacts/editor-logs'), { recursive: true });
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  } finally {
    await rm(profile, { recursive: true, force: true });
  }
}
