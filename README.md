# AWS Serverless Application Model (SAM) Snippets for VS Code

YAML snippets for [AWS Serverless Application Model (SAM) resources](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-specification-resources-and-properties.html), common Lambda configurations, parameters, conditions, and intrinsic functions in Visual Studio Code.

<!-- TIP-LIST:START -->
> [!TIP]
> **Stop AWS bill surprises before they ship.**
>
> Most infrastructure changes look harmless until next month's AWS bill lands. [CloudBurn](https://cloudburn.io) analyzes the cost impact of your AWS CDK changes right in the GitHub pull request, so expensive mistakes get caught during code review, while a fix is still a one-line change.
>
> <a href="https://github.com/marketplace/cloudburn-io"><img alt="Install CloudBurn from GitHub Marketplace" src="https://img.shields.io/badge/Install%20CloudBurn-GitHub%20Marketplace-brightgreen.svg?style=for-the-badge&logo=github"/></a>
>
> <details>
> <summary>💰 <strong>Set it up once, then never be surprised by AWS costs again</strong></summary>
> <br/>
>
> 1. **Install the free [CDK Diff PR Commenter GitHub Action](https://github.com/marketplace/actions/aws-cdk-diff-pr-commenter)** in the repository where you build your AWS CDK infrastructure
> 2. **Then install the [CloudBurn GitHub App](https://github.com/marketplace/cloudburn-io)** on the same repository
>
> From then on, every PR with infrastructure changes gets a comment with your CDK diff analysis, and CloudBurn adds a cost report next to it:
> - **Monthly cost impact**: whether this change raises or lowers your AWS bill, and by how much
> - **Per-resource breakdown**: which resources drive the change, old versus new monthly cost
> - **Region-aware pricing**: rates match the region your infrastructure actually deploys to
>
> Cost review happens inside code review, so you optimize as you code, while the context is still fresh.
>
> CloudBurn is free during beta. After launch, a free Community plan (1 repository, unlimited users) stays available.
>
> </details>
<!-- TIP-LIST:END -->

---
## Features

1. Adds support for the following SAM resource types:

```YAML
    AWS::Serverless::Api
    AWS::Serverless::Application
    AWS::Serverless::CapacityProvider
    AWS::Serverless::Connector
    AWS::Serverless::Function
    AWS::Serverless::GraphQLApi
    AWS::Serverless::HttpApi
    AWS::Serverless::LayerVersion
    AWS::Serverless::MicrovmImage
    AWS::Serverless::NetworkConnector
    AWS::Serverless::SimpleTable
    AWS::Serverless::StateMachine
    AWS::Serverless::WebSocketApi
```

2. Includes editable intrinsic functions and conditions, plus String, Number, CommaDelimitedList, and SSM parameter snippets.
3. Adds short templates for ZIP functions, image functions, and HTTP API events.
4. Generates full resource property scaffolds from a pinned AWS SAM schema, with documentation links and required-property annotations.
5. Available on the [Open VSX Registry](https://open-vsx.org/extension/dannysteenman/sam-snippets) for Gitpod support.

## Usage

Open a `.yaml` or `.yml` file and select **YAML** as its language mode. Type a prefix and choose its completion, or press `Ctrl+Space` to open suggestions. Use `Tab` and `Shift+Tab` to move between placeholders.

| Prefix | Inserts | Placement |
| --- | --- | --- |
| `sam` or `sam-template` | Minimal SAM template with an inline Lambda function | Empty file |
| `sam-function-zip` | Function using local source code | `Resources` |
| `sam-function-image` | Function using an ECR image | `Resources` |
| `sam-http-event` | HTTP API event | Function `Events` |
| `sam-parameter-string` | String parameter | `Parameters` |
| `sam-parameter-number` | Numeric parameter | `Parameters` |
| `sam-parameter-list` | Comma-delimited list parameter | `Parameters` |
| `sam-parameter-ssm` | SSM parameter reference | `Parameters` |
| `serverless-function` or `serverless-function-full` | Full Function property scaffold | `Resources` |

Other resource prefixes use the same pattern, such as `serverless-api` and `serverless-connector`. Existing resource, condition, and intrinsic prefixes are preserved; conditions and intrinsics also have `sam-` aliases.

Full property scaffolds include optional and alternative settings. Remove unused properties and fill in their values before deployment. For example, use the ZIP or image variant to avoid mixing `CodeUri`, `InlineCode`, and `ImageUri`. Snippets respect the editor's indentation settings.

`sam-length`, `sam-to-json-string`, and `sam-for-each` require `AWS::LanguageExtensions`. When combining it with SAM, list `AWS::LanguageExtensions` before `AWS::Serverless-2016-10-31` in `Transform`. `sam-get-stack-output` inserts the long form of `Fn::GetStackOutput` for resource property values.

---
## AWS CloudFormation Snippets for VS Code

If you use AWS CloudFormation to manage your infrastructure as code, check out the [CloudFormation Snippets](https://marketplace.visualstudio.com/items?itemName=dannysteenman.cloudformation-yaml-snippets) VS Code extension. This extension provides comprehensive coverage, including snippets for:

- All AWS CloudFormation resources
- All AWS Serverless Application Model (SAM) resource types

The snippets support both YAML and JSON CloudFormation templates, streamlining your infrastructure development workflow.

**Key features include:**
- Autocomplete by simply typing the resource name (e.g., `ec2-instance`)
- Intrinsic functions, conditions, and a wide variety of parameter types
- Placeholders for quick navigation within each resource
- Inline documentation links for each resource
- Automatic weekly updates with the latest CloudFormation Resource Specification

---
## Support

If you have a feature request or an issue, please let me know on [Github](https://github.com/towardsthecloud/vscode-sam-snippets/issues)

## Author

[Danny Steenman](https://towardsthecloud.com/about)

[![](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/towardsthecloud)
[![](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com/dannysteenman)
[![](https://img.shields.io/badge/GitHub-2b3137?style=for-the-badge&logo=github&logoColor=white)](https://github.com/towardsthecloud)
