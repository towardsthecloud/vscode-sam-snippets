# AWS Serverless Application Model (SAM) Snippets for VS Code

YAML snippets for [AWS Serverless Application Model (SAM) resources](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-specification-resources-and-properties.html), common Lambda configurations, parameters, conditions, and intrinsic functions in Visual Studio Code.

<!-- TIP-LIST:START -->
> [!TIP]
> **Catch AWS waste before and after you deploy.**
>
> [CloudBurn](https://cloudburn.io) is a free, open-source CLI that checks your Terraform and CloudFormation for costly patterns before deploy, then finds the waste already running in your AWS account. Run it locally or in CI.
>
> <a href="https://github.com/towardsthecloud/cloudburn"><img alt="Get the free CloudBurn CLI on GitHub" src="https://img.shields.io/badge/Get%20the%20free%20CLI-GitHub-brightgreen.svg?style=for-the-badge&logo=github"/></a>
>
> Want it managed across your AWS accounts? [CloudBurn Platform](https://cloudburn.io) runs it for you and keeps scan results in your own account. Join the waitlist for 30% off.
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
