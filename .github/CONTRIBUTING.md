# Contribution Guidelines

Thank you for your interest in contributing to the [AWS SAM Snippets for VS Code.](https://github.com/towardsthecloud/vscode-sam-snippets)

Please read through this document before submitting any issues or pull requests to ensure we have all the necessary information to effectively respond to your issue or contribution.

## Reporting Bugs or Feature Requests

We welcome you to use the GitHub issue tracker to report bugs or suggest features.

When filing an issue, please check [existing open](https://github.com/towardsthecloud/vscode-sam-snippets/issues), or [recently closed](https://github.com/towardsthecloud/vscode-sam-snippets/issues?utf8=%E2%9C%93&q=is%3Aissue%20is%3Aclosed%20), issues to make sure somebody else hasn't already reported the issue. Please try to include as much information as you can.

## Contributing new changes via Pull Requests

Contributions via pull requests are much appreciated. Before sending us a pull request, please ensure that:

1. You are working against the latest source on the _main_ branch.
2. You check existing open, and recently merged, pull requests to make sure someone else hasn't made a similar request already.
3. You open an issue to discuss any significant work - we would hate for your time to be wasted.

To send us a pull request, please:

1. Fork the repository.
2. Modify the source, focusing on the specific change you are contributing. If you also reformat all the code, it will be hard for us to focus on your change.
3. Commit to your fork using clear commit messages.
4. Send us a pull request, answering any default questions in the pull request interface.
5. Stay involved in the conversation.

GitHub provides additional documentation on [forking a repository](https://help.github.com/articles/fork-a-repo/) and
[creating a pull request](https://help.github.com/articles/creating-a-pull-request/).

## Updating your PR

If the maintainers notice anything that we'd like changed, we'll ask you to edit your PR before we merge it. There's no need to open a new PR, just edit the existing one. If you're not sure how to do that, [then here is a guide](https://github.com/RichardLitt/knowledge/blob/master/github/amending-a-commit-guide.md) on the different ways you can update your PR so that we can merge it.

## Licensing

See the [LICENSE](https://github.com/towardsthecloud/vscode-sam-snippets/blob/main/LICENSE) file for our project's licensing. We will ask you to confirm the licensing of your contribution.

## Development and validation

Use Node 24 (`fnm use` reads `.nvmrc`), then run `npm ci --ignore-scripts`. Install the AWS SAM CLI through Homebrew (`brew install aws-sam-cli`), or use Python 3.13 and `python -m pip install -r requirements.txt` for the versions pinned in CI. SAM includes its own compatible CloudFormation Linter; the requirements pin that supported version rather than an independently installed newer linter.

Run `npm test` from the repository root. It checks generated output, builds and inspects the VSIX, starts an isolated VS Code instance using the packaged extension, and validates completed examples with `sam validate --lint`. On Linux, use `xvfb-run -a npm test`. Tests use no AWS credentials and do not deploy resources. Reports, editor expansions, and completed examples remain in `.test-artifacts/`; CI retains them as artifacts. Use `VSCODE_TEST_VERSION=<version> npm run test:editor` to reproduce against a specific VS Code release after running the package checks.

## Updating snippets

`data/sam-resources.json` is a compact snapshot of the official AWS SAM schema, recording the source commit and SHA-256 digest. Run `npm run schema:update` and `npm run generate` to refresh it. To reproduce a snapshot, run `npm run schema:update -- <source-commit>`. The updater retains the existing commit when the resource definitions have not changed.

Edit common templates in `data/curated-snippets.json` and property defaults in `data/resource-overrides.json`, then regenerate. `data/schema-overrides.json` supplies explicit types for incomplete upstream properties or documented schema mismatches. Review those hints against AWS documentation when upstream definitions change. Required annotations combine the schema's required list with explicit `Required: Yes` documentation. Unknown property shapes fail the update instead of silently producing an incorrect snippet.

Intrinsic and condition snippets are maintained directly in their respective files. Keep placeholders editable, escape literal CloudFormation interpolation when needed, and preserve existing prefixes. The generated full resource snippets are property references; the short variants provide practical starting points. Do not add runtime extension code for build-time generation.

The weekly Update SAM definitions workflow opens or updates `codex/update-sam-definitions` and explicitly dispatches Validate for that branch. It uses GITHUB_TOKEN and requires the repository setting allowing Actions to create pull requests. Review and merge the PR before including it in a release. Dependabot handles tooling and action updates separately.

## Releasing

Update `package.json`, its lockfile, and `CHANGELOG.md` together in a reviewed PR. Before tagging, replace the version's `Unreleased` heading with its release date in `YYYY-MM-DD` format. The release guard rejects unfinished notes. After merging the release preparation, tag that commit with the matching version, for example `git tag v1.20.0` followed by `git push origin v1.20.0`.

The Release workflow checks the tag against the version and release notes, validates the extension, retains the tested VSIX for 30 days, and publishes that exact artifact independently to both registries. It uses the existing `VSCE_TOKEN` and `OPEN_VSX_TOKEN` secrets. A push to `main` validates changes without bumping versions or publishing.

If a registry fails, choose **Re-run failed jobs** on the existing release run within the artifact retention period. Completed versions are skipped safely. If the artifact has expired, re-run all jobs for the same tag to rebuild and validate it. Do not bump the version to retry a failed registry.
