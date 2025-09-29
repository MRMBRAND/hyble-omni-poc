# toolkit-boilerplate

This is the boilerplate for new hyble Toolkit apps.

The following things are set up:

| Feature               | Details                                    |
| --------------------- | ------------------------------------------ |
| Pipelines             | Azure Piplines: build, test and deployment |
| Environment Variables | our own method                             |
| Feature Flags         | our own method                             |
| Toolchain             | TypeScript, Vite, ESLint, Prettier         |
| Testing               | react-testing-library, msw                 |
| Auth                  | Auth0                                      |
| Api Client            | wrapper over fetch/auth0                   |
| Client Cache          | React Query                                |
| UI library            | Chakra                                     |

## Getting Started

When creating a new toolkit app, there are 2 main pieces - development and deployment. If you aren't familiar with how to deploy an application, you will likely need support - speak with the dev team.

### Development

Start by getting a new repository which uses this boilerplate as a starting point, then get the new boilerplate app setup and running.

1. Set up your new repository
1. Set up and run the app

#### Set up your new repository

There are three steps to getting your repository set up:

1. Create your new repository on Github
1. Clone this boilerplate repository
1. Point your boilerplate clone to your new repository and push

Since this is a boilerplate repo, you shouldn't push to this repository unless you are updating the boilerplate. When creating a new toolkit app, you will want to create a new repository on GitHub. Please use the convention `toolkit-your-app-name` e.g `toolkit-manage-format-categories`.

Then you should clone this repository down and change the git "origin" to point to your new repository:

```sh
git clone git@github.com:MRMBRAND/toolkit-boilerplate.git toolkit-your-app-name
git remote set-url origin git@github.com:MRMBRAND/toolkit-your-app-name.git`
```

Now you can push/pull to the new empty repo and use the boilerplate as your starting point.

#### Local Environment

Use Node Active LTS (currently v22).

Run the following commands to get the app setup and running.

```sh
npm install    # install app dependencies
npm run setup  # setup env vars and feature flags
npm run dev    # start dev server
```

Once you're up and running, rename the boilerplate references in `index.html`, `package.json` etc - best search for "boilerplate".

To set up your local environment variables, run `cp public/env.template.js public/env.js` to create the real `env.js` file, then populate the variables using values from the [Azure DevOps Library](https://dev.azure.com/mrmltd/Brand%20Creator/_library?itemType=VariableGroups&view=VariableGroupView&variableGroupId=37&path=TOOLKIT-COMMON-DEV).

## Deployment

1. Create Static Web Apps on Azure
1. Create Variable Groups and update Pipeline
1. Create and run Pipeline
1. Create custom domains
1. Configure Auth0

### Create Static Web Apps on Azure

To deploy the app, you will need to have infrastructure to deploy to.

Create three Static Web Apps - one for dev, preprod and prod.

These should be created in the dev and prod Subscriptions respectively.

- `hyble-toolkit-your-app-name`
- `hyble-toolkit-your-app-name-preprod`
- `hyble-toolkit-your-app-name-dev`

### Create variable groups and update pipeline

We have a "common" variable group which contains variables common to all toolkit apps such as the Auth0 config and Toolkit Portal URL.

With Static Web Apps, the deployment token is used to reference the target App to deploy to. Since this is app-specific, we don't want to store these in the common variable group and instead we should create an app-specific variable group.

We can also add other app-specific variables to this group (for example a product-oriented app may need the products api host which isn't in the common group).

Create your app-specific Variable Group and add your deployment token variable alongside any other app-specific variables you need, and include them in the pipeline config using the `variables` parameter.

Note the deployment token variable is referenced in the pipeline code, see the pipeline config for the required variable name.

Please use the conventions currently used for variable group names.

For example, where you see:

```yaml
variables:
  - group: TOOLKIT-COMMON-DEV
  - group: TOOLKIT-BOILERPLATE-DEV
```

you should update to:

```yaml
variables:
  - group: TOOLKIT-COMMON-DEV
  - group: TOOLKIT-YOUR-APP-NAME-DEV
```

Any variables you want to access in the application will need to be added to the `/public/env.template.js` file.

Remember you will need to add them to your local `/public/env.js` file to access them locally.

### Create and run Pipeline

You will want to merge your recent pipeline changes to the `main` branch before running this step.

Create a new pipeline in Azure DevOps [here](https://dev.azure.com/mrmltd/Brand%20Creator/_build).

Don't forget to rename the pipeline to give it a good name (please use existing conventions).

Choose your new repository, make sure the pipeline picks up your new app's YAML file (and not the boilerplate YAML file), then run the pipeline. It should deploy to your new app service.

### Create custom domains

Next, we should set up our custom domains - this is done in AWS Route53 and in the Custom Domains settings of the App Service.

For custom domains, the new naming convention in for Toolkit apps is `your-app-name.hyble.app`.

Speak with the team if you haven't done this before.

### Configure Auth0

All toolkit apps use the "Admin Site" Auth0 app.

We need to add our application URLs into the [Auth0 app config](https://manage.auth0.com/dashboard/eu/mrmglobal-dev/applications/LjRHTUYaoXwpmuZeWsVZSuJsiy8PsUmJ/settings). That link is to the dev app, the production app will need updated with the production URLs.

Add the new URL to the following sections.

- Allowed Callback URLs
- Allowed Logout URLs
- Allowed Web Origins
- Allowed Origins (CORS)

This will need done in both the development and production tenants with the appropriate URLs.

Note - add the custom domain URLs, not the default Azure URLs.
