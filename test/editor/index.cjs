const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vscode = require('vscode');
const YAML = require('yaml');

exports.run = async function () {
  const extension = vscode.extensions.getExtension('dannysteenman.sam-snippets');
  assert.ok(extension, 'Extension must be loaded');
  const catalog = {};
  const schema = JSON.parse(fs.readFileSync(process.env.SAM_TEST_SCHEMA)).resources;
  for (const contribution of extension.packageJSON.contributes.snippets) {
    assert.equal(contribution.language, 'yaml');
    Object.assign(catalog, JSON.parse(fs.readFileSync(path.join(extension.extensionPath, contribution.path))));
  }
  const document = await vscode.workspace.openTextDocument({ language: 'yaml' });
  const editor = await vscode.window.showTextDocument(document);
  const results = [];
  const expansions = {};
  async function check(name, fn) {
    try { await fn(); results.push({ name, passed: true }); }
    catch (error) { results.push({ name, passed: false, error: error.message }); }
  }
  async function render(name, tabSize = 2, content = '') {
    assert.ok(catalog[name], `Missing snippet: ${name}`);
    await vscode.commands.executeCommand('leaveSnippet');
    await editor.edit(edit => edit.replace(new vscode.Range(0, 0, document.lineCount, 0), content));
    editor.selection = new vscode.Selection(document.positionAt(content.length), document.positionAt(content.length));
    editor.options = { insertSpaces: true, tabSize };
    const body = catalog[name].body;
    assert.ok(await editor.insertSnippet(new vscode.SnippetString(Array.isArray(body) ? body.join('\n') : body)));
    return document.getText();
  }
  async function nextPlaceholder() {
    const current = editor.selection;
    const changed = new Promise((resolve, reject) => {
      const timer = setTimeout(() => { subscription.dispose(); reject(new Error('Tab navigation did not advance')); }, 5000);
      const subscription = vscode.window.onDidChangeTextEditorSelection(event => {
        if (event.textEditor === editor && !event.selections[0].isEqual(current)) {
          clearTimeout(timer); subscription.dispose(); resolve();
        }
      });
    });
    await vscode.commands.executeCommand('jumpToNextSnippetPlaceholder');
    await changed;
  }
  function parse(text) {
    const doc = YAML.parseDocument(text);
    assert.deepEqual(doc.errors, [], 'Inserted snippet must be valid YAML');
    return doc.toJS();
  }
  await check('Connector inserts list permissions and resource references', async () => {
    const props = parse(await render('AWS::Serverless::Connector')).LogicalID.Properties;
    assert.ok(Array.isArray(props.Permissions), 'Connector permissions must insert a YAML list');
    assert.deepEqual(props.Permissions, ['Read']);
    assert.equal(typeof props.Source.Id, 'string');
    assert.equal(typeof props.Destination.Id, 'string');
  });
  await check('GraphQL inserts structured properties', async () => {
    const props = Object.values(parse(await render('AWS::Serverless::GraphQLApi')))[0].Properties;
    for (const key of ['Auth', 'DataSources', 'Functions', 'Resolvers']) {
      assert.ok(props[key] && typeof props[key] === 'object' && !Array.isArray(props[key]), `${key} must be a mapping`);
    }
  });
  await check('And inserts two editable condition references', async () => {
    const value = parse(await render('Fn::And'));
    assert.equal(value.length, 2);
    assert.match(document.getText(), /!Condition FirstCondition/);
    assert.match(document.getText(), /!Condition SecondCondition/);
    assert.equal(document.getText(editor.selection), 'FirstCondition');
  });
  await check('ZIP and image variants keep code sources separate', async () => {
    const zip = parse(await render('SAM-function-zip')).Function.Properties;
    assert.equal(zip.CodeUri, 'src/');
    assert.equal(zip.Handler, 'app.handler');
    assert.equal(zip.Runtime, 'python3.13');
    assert.equal(zip.ImageUri, undefined);
    const image = parse(await render('SAM-function-image')).Function.Properties;
    assert.equal(image.PackageType, 'Image');
    assert.equal(typeof image.ImageUri, 'string');
    assert.equal(image.CodeUri, undefined);
    assert.equal(image.InlineCode, undefined);
  });
  await check('HTTP event inserts under an existing Events mapping', async () => {
    const template = parse(await render('SAM-http-event', 2, 'Events:\n  '));
    assert.equal(template.Events.ApiRequest.Type, 'HttpApi');
    assert.deepEqual(template.Events.ApiRequest.Properties, { Path: '/hello', Method: 'get' });
  });
  await check('Tab navigation selects the ZIP code path after the logical ID', async () => {
    await render('SAM-function-zip');
    assert.equal(document.getText(editor.selection), 'Function');
    await vscode.commands.executeCommand('workbench.action.focusActiveEditorGroup');
    await nextPlaceholder();
    assert.equal(document.getText(editor.selection), 'src/');
  });
  await check('Replacing a string placeholder with false keeps its YAML string type', async () => {
    const text = await render('AWS::Serverless::Function');
    const target = text.split('\n').findIndex(line => line.trim().startsWith('Description:'));
    await vscode.commands.executeCommand('workbench.action.focusActiveEditorGroup');
    for (let index = 0; index < 50 && editor.selection.active.line < target; index++) await nextPlaceholder();
    assert.equal(editor.selection.active.line, target);
    assert.equal(document.getText(editor.selection), 'String', 'String quotes must remain outside the editable placeholder');
    await editor.edit(edit => edit.replace(editor.selection, 'false'));
    assert.equal(parse(document.getText()).LogicalID.Properties.Description, 'false');
  });
  await check('Every contributed snippet inserts at two and four space indentation', async () => {
    for (const name of Object.keys(schema)) assert.ok(catalog[name], `Missing SAM resource: ${name}`);
    for (const name of Object.keys(catalog)) {
      for (const tabSize of [2, 4]) {
        const text = await render(name, tabSize);
        assert.ok(text.length > 0, name);
        assert.ok(!text.includes('\t'), `${name} must respect insertSpaces`);
        const value = parse(text);
        assert.ok(document.getText(editor.selection).length > 0, `${name} must have an editable placeholder`);
        if (schema[name]) {
          const properties = Object.values(value)[0].Properties;
          assert.deepEqual(Object.keys(properties).sort(), Object.keys(schema[name].properties).sort());
          for (const [key, property] of Object.entries(schema[name].properties)) {
            const actual = properties[key];
            if (property.type === 'array') assert.ok(Array.isArray(actual), `${name}.${key} must be a list`);
            else if (property.type === 'object') assert.ok(actual && typeof actual === 'object' && !Array.isArray(actual), `${name}.${key} must be a mapping`);
            else if (property.type === 'integer') assert.ok(Number.isInteger(actual), `${name}.${key} must be an integer`);
            else assert.equal(typeof actual, property.type, `${name}.${key} has the wrong YAML type`);
          }
          const typeLine = text.split('\n').find(line => line.trim() === 'Type: ' + name);
          assert.equal(typeLine, ' '.repeat(tabSize) + 'Type: ' + name);
        }
        if (tabSize === 2) expansions[name] = text;
      }
    }
  });
  await check('Typing the legacy Connector prefix offers and inserts the completion', async () => {
    await vscode.commands.executeCommand('leaveSnippet');
    await editor.edit(edit => edit.replace(new vscode.Range(0, 0, document.lineCount, 0), ''));
    editor.selection = new vscode.Selection(0, 0, 0, 0);
    await vscode.commands.executeCommand('workbench.action.focusActiveEditorGroup');
    await vscode.commands.executeCommand('type', { text: 'serverless-connector' });
    await vscode.commands.executeCommand('editor.action.triggerSuggest');
    for (let attempt = 0; attempt < 50; attempt++) {
      await vscode.commands.executeCommand('acceptSelectedSuggestion');
      if (document.getText().includes('Type: AWS::Serverless::Connector')) return;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.fail('Connector completion did not insert');
  });
  const artifacts = process.env.SAM_TEST_ARTIFACTS;
  fs.mkdirSync(artifacts, { recursive: true });
  fs.writeFileSync(path.join(artifacts, 'expanded-snippets.json'), JSON.stringify(expansions, null, 2) + '\n');
  fs.writeFileSync(path.join(artifacts, 'editor-report.json'), JSON.stringify({ vscode: vscode.version, results }, null, 2) + '\n');
  for (const result of results) console.log(`${result.passed ? 'PASS' : 'FAIL'} ${result.name}${result.error ? ': ' + result.error : ''}`);
  assert.ok(results.every(result => result.passed), 'Editor smoke tests failed; see editor-report.json');
};
