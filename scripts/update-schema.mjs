import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const ref = process.argv[2] || 'develop';
async function get(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(60_000) });
  if (!response.ok) throw new Error(`${response.status}: ${url}`);
  return response;
}
const { sha } = await (await get(`https://api.github.com/repos/aws/serverless-application-model/commits/${encodeURIComponent(ref)}`)).json();
assert.match(sha, /^[a-f0-9]{40}$/);
const url = `https://raw.githubusercontent.com/aws/serverless-application-model/${sha}/samtranslator/schema/schema.json`;
const text = await (await get(url)).text();
const schema = JSON.parse(text);
const definitions = schema.definitions;
// Some upstream PassThroughProp entries omit both a type and documentation.
const overrides = JSON.parse(await readFile('data/schema-overrides.json', 'utf8'));

function resolve(node) {
  if (node.$ref) {
    assert.ok(node.$ref.startsWith('#/definitions/'), `Unsupported reference: ${node.$ref}`);
    return resolve(definitions[node.$ref.slice('#/definitions/'.length)]);
  }
  if (node.allOf) return resolve(node.allOf[0]);
  if (node.anyOf) {
    const choices = node.anyOf.map(resolve);
    // A generic object branch permits intrinsic functions; prefer a literal value.
    return choices.find(choice => choice.type && (choice.type !== 'object' || choice.properties || choice.additionalProperties)) || choices[0];
  }
  return node;
}
function property(node, required, override) {
  const resolved = resolve(node);
  const documented = node.markdownDescription?.match(/\*Type\*:\s*([^\n]+)/)?.[1] || '';
  const primitive = documented.match(/\b(Boolean|Integer|Number|String|List|Map|JSON)\b/)?.[1];
  const types = { Boolean: 'boolean', Integer: 'integer', Number: 'number', String: 'string', List: 'array', Map: 'object', JSON: 'object' };
  const linkedObject = /^\[[^\]]+\]\(https:\/\/docs\.aws\.amazon\.com\/AWSCloudFormation\/latest\/UserGuide\/(?:aws-properties-[^)]+|aws-resource-[^)]+#cfn-[^)]+)\)/.test(documented);
  const type = resolved.type || types[primitive] || (linkedObject ? 'object' : override);
  assert.ok(['boolean', 'integer', 'number', 'string', 'array', 'object'].includes(type), `Unknown property shape: ${JSON.stringify(node)}`);
  const result = { type, required };
  if (resolved.enum?.every(value => typeof value === 'string')) result.choices = resolved.enum;
  return result;
}

const resources = {};
for (const resource of Object.values(definitions)) {
  const type = resource.properties?.Type?.enum?.[0];
  if (!type?.startsWith('AWS::Serverless::')) continue;
  const properties = resolve(resource.properties.Properties);
  assert.ok(properties.properties, `${type} has no property definitions`);
  resources[type] = {
    documentation: `https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-${type.split('::')[2].toLowerCase()}.html`,
    properties: Object.fromEntries(Object.entries(properties.properties).sort(([a], [b]) => a.localeCompare(b, 'en')).map(([name, node]) => [name, property(node, properties.required?.includes(name) || false, overrides[type]?.[name])])),
  };
}
assert.ok(Object.keys(resources).length > 0, 'No SAM resource definitions found');
const sorted = Object.fromEntries(Object.entries(resources).sort(([a], [b]) => a.localeCompare(b, 'en')));
const file = 'data/sam-resources.json';
let previous;
try { previous = JSON.parse(await readFile(file, 'utf8')); }
catch (error) { if (error.code !== 'ENOENT') throw error; }
if (JSON.stringify(previous?.resources) === JSON.stringify(sorted)) {
  console.log('SAM resource definitions are unchanged.');
} else {
  await mkdir('data', { recursive: true });
  await writeFile(file, JSON.stringify({ source: { commit: sha, url, sha256: createHash('sha256').update(text).digest('hex') }, resources: sorted }, null, 2) + '\n');
  console.log(`Saved ${Object.keys(sorted).length} SAM resource definitions from ${sha}. Run npm run generate.`);
}
