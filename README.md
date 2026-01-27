# Deployer K8s PaaS (Deployment and App Configuration repository)

## About
Welcome to your repository which got created by requesting an instance of the
**Deployer K8s PaaS** service in Platform McKinsey (PMcK).<br/>
This repository comes with pre-defined GitHub Action (GHA) workflows that enable you
to deploy your application to a shared Kubernetes (K8s) cluster as well
as deploying infrastructure in a shared AWS account (eg. S3, RDS).<br/>
Depending on whether you selected the starter template option during provisioning,
your repository may include a sample Next.js application to help you get started.
Read more about the [repository structure](#repository-structure) and [sample application](#sample-application) below.

## Documentation
Documentation about the **Deployer K8s PaaS** service can be found in [Platform McKinsey Knowledge Base](https://platform.mckinsey.com/knowledge-base/service-guide/852265408/deployer-k8s-paas).<br/>
Below are some articles to start with:
* [Deployer-K8s-PaaS architecture diagram](https://platform.mckinsey.com/knowledge-base/service-guide/1029898526/deployer-k8s-paas-application-architecture)
* [Getting Started guide](https://platform.mckinsey.com/knowledge-base/service-guide/1054572739/getting-started)

Please also check our [HowTo articles](https://platform.mckinsey.com/knowledge-base/service-guide/1144328085/how-tos) that address typical scenarios like creating/configuring/consuming S3 buckets and databases etc.

## Repository structure
Your repository contains the following key directories:

* **`.github/workflows/`** - Managed CD workflows that enable application & infrastructure deployment
* **`deployer-apps/<instance-name>/`** - Application-specific files:
  * `src/` - (Optional) Your application source code, if you selected the starter template
  * `<environment>-<region>/manifests/` - Helm charts and Kubernetes manifests for deploying your application
  * `<environment>-<region>/iac/` - Terraform infrastructure configuration files for AWS resources (S3, RDS, etc.)

## GitHub Action workflows
Your repository includes managed GHA workflows that enable you to deploy and manage your application with minimum effort.<br/>
These workflows are managed centrally and should not be edited by the customer (all changes to these workflow files may be overwritten at any time).<br/>

### Deployment Workflows
* **[instance name]-[environment]-Deploy All**: Executes all deployment workflows (sync application, update secrets, and deploy infrastructure)
* **[instance name]-[environment]-Deploy infra**: Deploys AWS infrastructure as configured in `./deployer-apps/<instance-name>/<environment>-<region>/iac/`
* **[instance name]-[environment]-Deploy secrets**: Creates K8s secrets based on GitHub repository secrets. See [documentation](https://platform.mckinsey.com/knowledge-base/service-guide/1043824755/how-to-use-secrets-in-your-application)
* **[instance name]-[environment]-Sync argo app**: Force synchronizes your application manifests from `./deployer-apps/<instance-name>/<environment>-<region>/manifests/` to your K8s namespace

### Additional Workflows
* **Deployer Promote Environment**: Promotes configuration changes between environments (dev → stg → prod) by creating a Pull Request
* **Security scan**: Automatically scans code for security vulnerabilities on pull requests and manual triggers


## Sample application

If you selected the starter template option, your repository includes a basic Next.js starter application
to help you get started with deploying on Deployer K8s PaaS.

The starter template includes:
- Next.js app with health/status API endpoints
- Kubernetes manifests and Docker CI/CD workflow
- Ready to deploy and customize

**Application URL Template**: `https://app-<k8s_namespace>.<cloudflare_domain>`, where:

* `<k8s_namespace>` is the Kubernetes namespace your application is hosted in. You can obtain this from the Platform McKinsey instance details: `Kubernetes namespace name` field
* `<cloudflare_domain>` is the Cloudflare base domain, which you can find in the `deployer-apps/<instance-name>/<environment>-<region>/manifests/values.yaml` file. The default template uses `cf.platform.mckinsey.cloud`

Check the [HowTo articles](https://platform.mckinsey.com/knowledge-base/service-guide/1144328085/how-tos) to
discover how to customize this URL further.

## Access application logs in Dynatrace
Applications running on Deployer K8s PaaS are sending their logs to the Firm’s Observability system (Dynatrace). In order to grant users access to these logs, Dynatrace is leveraging the ProductID which is assigned to a specific application.

Check the [HowTo articles](https://platform.mckinsey.com/knowledge-base/service-guide/1170245292/how-to-access-application-logs-in-dynatrace-for-applications-hosted-on-deployer-k8s-paas) to discover how to
get access on application logs in Dynatrace.

## Setup local development environment

In order to start developing your application locally, you may want to install
some standard tooling (if not done already).

### Install Docker
Install [Docker for Business](https://mckinsey.service-now.com/ghd?id=mck_app_cat_item&table=pc_software_cat_item&sys_id=157a289187c6c1d0011e52c83cbb35ef) and enable the Kubernetes option.

As an alternative to Docker, you may want to install [Podman Desktop](https://platform.mckinsey.com/team/no-team/create-service/d4a3647c-10ee-44da-848d-b7a52610f633) instead.

### Install Kubernetes tooling
```bash
brew install helm kubectl
```

### Configure pulling images
To pull images from OneFirm Artifactory ([JFrog](https://mckinsey.jfrog.io/ui/login/)), you need to create a secret in your local K8s cluster as shown below:
```bash
kubectl create secret docker-registry regcred -n <namespace> \
  --docker-server=mckinsey-<productname>-docker.jfrog.io \
  --docker-username=<Firstname_Lastname@mckinsey.com> \ 
  --docker-password=<API-Token> \ 
  --docker-email=<Firstname_Lastname@mckinsey.com>
```

### Install Helm chart
In order to deploy your application to your locally running K8s cluster, execute the below command:
```bash
# Replace <instance-name>, <environment>, and <region> with your actual values
helm install app ./deployer-apps/<instance-name>/<environment>-<region>/manifests
```

## Pre-commit
Pre-commit hooks run a set of actions (defined in a [config file](./.pre-commit-config.yaml))
on all new/changed files that are part of a commit.<br/>
In case any of the hooks detected a failure, it will cancel the commit and prevent
you from pushing to the remote repository.<br/>
Using pre-commit hooks is a best practice and thus recommended to use.

### Install pre-commit binary
```bash
brew install pre-commit
```

### Install pre-commit hooks
After you cloned the repository, you have to run the below command in the repository root directory to install/activate the pre-commit hooks
configured in the [config file](./.pre-commit-config.yaml).
```bash
pre-commit install
```

**NOTE:** 
* The pre-commit [config file](./.pre-commit-config.yaml) that is deployed along with this repository requires some dependencies to be installed for the pre-commit hooks to work (see below).
* The Terraform pre-commit hooks are disabled by default, as they require you to have access to the Firm's Terraform Enterprise (TFE) solution. If you have access to TFE and would like to leverage the Terraform pre-commit hooks, simply uncomment the respective section in the [config file](./.pre-commit-config.yaml).

### Install GitGuardian
```bash
brew install ggshield

# to authenticate:
ggshield auth login
```

### Install Terraform tools
**Note:** The Terraform pre-commit hooks are disabled by default, as they require you to have access to the Firm's Terraform Enterprise (TFE) solution. If you have access to TFE and would like to leverage the Terraform pre-commit hooks, simply uncomment the respective section in the [config file](./.pre-commit-config.yaml).

```bash
brew install tfenv tflint terraform_docs

# to select Terraform version:
tfenv use 1.9.3

# to authenticate to Terraform Enterprise:
terraform login terraform.mckinsey.cloud
```
