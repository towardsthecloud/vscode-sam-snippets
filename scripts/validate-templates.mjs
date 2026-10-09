import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import YAML from 'yaml';

const directory = '.test-artifacts/templates';
await mkdir(directory + '/src', { recursive: true });
await writeFile(directory + '/src/app.py', 'def handler(event, context):\n    return {"statusCode": 200, "body": "Hello"}\n');
const snippets = JSON.parse(await readFile('.test-artifacts/expanded-snippets.json', 'utf8'));
const read = name => {
  assert.ok(snippets[name], `Missing editor expansion: ${name}. Run npm run test:editor first.`);
  return YAML.parse(snippets[name]);
};
const bootstrap = read('SAM-template');
const wrap = resources => ({ AWSTemplateFormatVersion: '2010-09-09', Transform: 'AWS::Serverless-2016-10-31', Resources: resources });
const zip = read('SAM-function-zip');
const http = structuredClone(zip);
http.Function.Properties.Events = read('SAM-http-event');
const connector = wrap({
  ...bootstrap.Resources,
  Table: { Type: 'AWS::Serverless::SimpleTable' },
  ...read('AWS::Serverless::Connector'),
});
const conditions = `Parameters:\n  Value:\n    Type: String\n    Default: Expected\nConditions:\n  FirstCondition: !Equals [!Ref Value, Expected]\n  SecondCondition: !Equals [!Ref Value, Expected]\n  Combined: ${snippets['Fn::And']}\n`;
const conditional = structuredClone(bootstrap);
conditional.Resources.Function.Condition = 'Combined';
const templates = {
  bootstrap: YAML.stringify(bootstrap), zip: YAML.stringify(wrap(zip)),
  image: YAML.stringify(wrap(read('SAM-function-image'))),
  http: YAML.stringify(wrap(http)), connector: YAML.stringify(connector),
  conditions: YAML.stringify(conditional) + conditions,
  parameters: YAML.stringify({
    ...bootstrap,
    Parameters: Object.assign({}, ...['SAM-parameter-string', 'SAM-parameter-number', 'SAM-parameter-list', 'SAM-parameter-ssm'].map(read)),
  }),
};
const results = [];
for (const [name, template] of Object.entries(templates)) {
  const path = `${directory}/${name}.yaml`;
  await writeFile(path, template);
  const result = spawnSync('sam', ['validate', '--lint', '--region', 'us-east-1', '--template-file', path], {
    encoding: 'utf8', timeout: 120_000,
    env: { ...process.env, SAM_CLI_TELEMETRY: '0', AWS_EC2_METADATA_DISABLED: 'true' },
  });
  results.push({ name, passed: result.status === 0, output: (result.stdout || '') + (result.stderr || ''), error: result.error?.message });
  console.log(`${result.status === 0 ? 'PASS' : 'FAIL'} SAM validation: ${name}`);
}
await writeFile('.test-artifacts/templates-report.json', JSON.stringify(results, null, 2) + '\n');
assert.ok(results.every(result => result.passed), 'SAM template validation failed; see templates-report.json');
