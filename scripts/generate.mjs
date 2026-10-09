import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';

const read = async path => JSON.parse(await readFile(path, 'utf8'));
const { resources } = await read('data/sam-resources.json');
const overrides = await read('data/resource-overrides.json');
const snippets = await read('data/curated-snippets.json');
const defaults = { boolean: false, integer: 0, number: 0, string: 'String', array: [], object: {} };
const escape = text => text.replace(/[\\$}]/g, '\\$&');

for (const [type, resource] of Object.entries(resources)) {
  let index = 1;
  const body = ['${1:LogicalID}:', '\tType: ' + type, '\tProperties:'];
  for (const [name, property] of Object.entries(resource.properties)) {
    const value = overrides[type]?.[name] ?? defaults[property.type];
    let placeholder;
    if (property.choices && !Object.hasOwn(overrides[type] || {}, name)) {
      placeholder = `\${${++index}|${property.choices.map(choice => choice.replace(/[\\,|]/g, '\\$&')).join(',')}|}`;
      if (property.type === 'string') placeholder = `"${placeholder}"`;
    } else {
      // JSON is valid YAML and preserves the shape of lists, objects and scalars.
      const serialized = JSON.stringify(value);
      placeholder = property.type === 'string'
        ? `"\${${++index}:${escape(serialized.slice(1, -1))}}"`
        : `\${${++index}:${escape(serialized)}}`;
    }
    body.push(`\t\t${name}: ${placeholder}${property.required ? ' # Required' : ''}`);
  }
  body.push('$0');
  const prefix = 'serverless-' + type.split('::')[2].toLowerCase();
  snippets[type] = {
    prefix: [prefix, prefix + '-full'], body,
    description: `Full ${type} property scaffold. Remove unused properties and replace placeholders before deployment.\n${resource.documentation}`,
    scope: 'yaml',
  };
}
for (const [type, properties] of Object.entries(overrides)) {
  for (const name of Object.keys(properties)) assert.ok(resources[type]?.properties[name], `Obsolete override: ${type}.${name}`);
}
const output = JSON.stringify(snippets, null, 2) + '\n';
const file = 'snippets/yaml-sam-resource-types.json';
if (process.argv.includes('--check')) {
  assert.equal(await readFile(file, 'utf8'), output, 'Generated snippets are stale. Run npm run generate.');
  console.log('Generated snippets match the pinned SAM definitions and curated snippets.');
} else {
  await writeFile(file, output);
  console.log(`Generated ${Object.keys(snippets).length} SAM and common snippets.`);
}
