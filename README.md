# AWS Serverless Application Model (SAM) Snippets for VS Code

[![](https://img.shields.io/visual-studio-marketplace/v/dannysteenman.sam-snippets?color=374151&label=Visual%20Studio%20Marketplace&labelColor=000&logo=visual-studio-code&logoColor=0098FF)](https://marketplace.visualstudio.com/items?itemName=dannysteenman.sam-snippets)
[![](https://img.shields.io/visual-studio-marketplace/v/dannysteenman.sam-snippets?color=374151&label=Open%20VSX%20Registry&labelColor=000&logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2aWV3Qm94PSI0LjYgNSA5Ni4yIDEyMi43IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0zMCA0NC4yTDUyLjYgNUg3LjN6TTQuNiA4OC41aDQ1LjNMMjcuMiA0OS40em01MSAwbDIyLjYgMzkuMiAyMi42LTM5LjJ6IiBmaWxsPSIjYzE2MGVmIi8+CiAgPHBhdGggZD0iTTUyLjYgNUwzMCA0NC4yaDQ1LjJ6TTI3LjIgNDkuNGwyMi43IDM5LjEgMjIuNi0zOS4xem01MSAwTDU1LjYgODguNWg0NS4yeiIgZmlsbD0iI2E2MGVlNSIvPgo8L3N2Zz4=&logoColor=0098FF)](https://open-vsx.org/extension/dannysteenman/sam-snippets)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/dannysteenman.sam-snippets 'Currently Installed')](https://marketplace.visualstudio.com/items?itemName=dannysteenman.sam-snippets)
[![Rating](https://img.shields.io/visual-studio-marketplace/stars/dannysteenman.sam-snippets)](https://marketplace.visualstudio.com/items?itemName=dannysteenman.sam-snippets)

This extension adds YAML snippets for **all** [AWS Serverless Application Model (SAM) resources](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-specification-resources-and-properties.html) into Visual Studio Code.

<!-- TIP-LIST:START -->
> [!TIP]
> **Stop AWS bill surprises from happening.**
>
> Most infrastructure changes look harmless until you see next month's AWS bill. [CloudBurn](https://cloudburn.io) prevents this by analyzing the cost impact of your AWS CDK changes directly in GitHub pull requests, catching expensive mistakes during code review when fixes are quick, not weeks later when they're costly and risky.
>
> <a href="https://github.com/marketplace/cloudburn-io"><img alt="Install CloudBurn from GitHub Marketplace" src="https://img.shields.io/badge/Install%20CloudBurn-GitHub%20Marketplace-brightgreen.svg?style=for-the-badge&logo=github"/></a>
>
> <details>
> <summary>💰 <strong>Set it up once, then never be surprised by AWS costs again</strong></summary>
> <br/>
>
> 1. **First install the free [CDK Diff PR Commenter GitHub Action](https://github.com/marketplace/actions/aws-cdk-diff-pr-commenter)** in your repository where you build your AWS CDK infrastructure
> 2. **Then install the [CloudBurn GitHub App](https://github.com/marketplace/cloudburn-io)** on the same repository
>
> **What happens now:**
>
> Whenever you open a PR with infrastructure changes, the GitHub Action comments with your CDK diff analysis. CloudBurn reads that diff and automatically adds a separate comment with a detailed cost report showing:
> - **Monthly cost impact** – Will this change increase or decrease your AWS bill? By how much?
> - **Per-resource breakdown** – See exactly which resources are driving costs (old vs. new monthly costs)
> - **Region-aware pricing** – We pick the right AWS pricing based on the region where your infrastructure is deployed
>
> Your team can now validate cost impact alongside infrastructure changes during code review. Essentially, this shifts FinOps left where you optimize costs as you code, not weeks later when context is lost and production adjustments require more time and carry added risk.
>
> CloudBurn will be free during beta. After launch, a free Community plan (1 repository with unlimited users) will always be available.
>
> </details>
<!-- TIP-LIST:END -->

---
## Features

1. Adds support for the following SAM resource types:

```YAML
    AWS::Serverless::Api
    AWS::Serverless::Application
    AWS::Serverless::Connector
    AWS::Serverless::Function
    AWS::Serverless::GraphQLApi
    AWS::Serverless::HttpApi
    AWS::Serverless::LayerVersion
    AWS::Serverless::SimpleTable
    AWS::Serverless::StateMachine
```

2. Includes intrinsic functions, conditions, and a variety of parameter types.
3. Utilizes placeholders for quick navigation within the properties of each resource.
4. Provides documentation links for each resource.
5. Available on the [Open VSX Registry](https://open-vsx.org/extension/dannysteenman/sam-snippets) for Gitpod support.

## Usage

* **Step 1.** Install this extension
* **Step 2.** create a `.yml` file to start working on your AWS SAM project.
* **Step 3.** Check in the bottom right-hand corner of the VS Code editor that the file type is listed as "YAML".
* **Step 4.** To start with the basic template structure, type `sam` to get the YAML formatted template fragment.
* **Step 5.** Start adding resources in the resource section by using their prefix name e.g. ```serverless-api``` equals resource type ```AWS::Serverless::Api```

> **Note:** Once you start typing a prefix (explained in step 5), the corresponding snippet will show up in the dropdown menu. If this doesn't happen automatically, press `ctrl + space` to invoke IntelliSense and search for the prefix of the resource type that you want to add (as listed in step 5).

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
