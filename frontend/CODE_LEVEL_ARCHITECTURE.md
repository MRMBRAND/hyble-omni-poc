## Code-level architecture (WIP)

## Table of contents

- [Stack and Framework](#stack-and-framework)
  - [TypeScript and Vite](#typescript-and-vite)
- [Environment Variables](#environment-variables)
  - [Local development](#local-development)
  - [Deployed environments](#deployed-environments)
- [Feature Flags](#feature-flags)
  - [Local development](#local-development-1)
  - [Deployed environments](#deployed-environments-1)
- [Startup](#startup)
- [Routing](#routing)
- [Auth](#auth)
- [API Requests](#api-requests)
- [Caching / Server-side state](#caching--server-side-state)
- [UI Library](#ui-library)
- [Analytics and Observability](#analytics-and-observability)
- [Testing](#testing)
- [State Management](#state-management)
- [Pipelines, infrastructure and deployment](#pipelines-infrastructure-and-deployment)

## Stack and Framework

### TypeScript and Vite

The boilerplate scaffolds a React app using Vite with TypeScript.

Important config files:

| File                     | Description                                                                                            |
| ------------------------ | ------------------------------------------------------------------------------------------------------ |
| package.json             | project config, dependencies, scripts                                                                  |
| tsconfig.json            | tsconfig entry point which reference the app and node config files                                     |
| tsconfig.app.json        | see "include" parameter - this is used for the entire source folder which includes our tests           |
| tsconfig.node.json       | see "include" parameter - this is used only for the Vite config file (weird, but this is default Vite) |
| vite.config.js           | config for Vite and Vitest (build and test)                                                            |
| eslint.config.json       | linting rules                                                                                          |
| .prettierrc              | formatting rules                                                                                       |
| .nvmrc                   | stores node version for use with nvm                                                                   |
| staticwebapp.config.json | config for Azure Static Web App infrastructure                                                         |
| azure-pipelines.yml      | entry point for pipeline                                                                               |
| .pipeline/\*             | pipeline config                                                                                        |
| GitVersion.yml           | rules for version bump                                                                                 |

## Environment Variables

We don't use the typical "build-time" environment variables where you have `.env` files and reference them via `import.meta`.

Instead, we use "deploy-time" environment variables where the variables are decoupled from the build entirely and are fetched over HTTP. The benefits of this approach are that we have a single build artififact for each version and we can have this same version running on our environments. It also allows us to update the environenment variables without rebuilding the app.

The way this works is we have a script tag in `index.html` which synchronously loads our `env.js` file. This guarantees that the environment variables exist when the app files are being run.

The environment variables are stored globally on the `window` object so can be accessed anywhere in the app via `window.ENV_CONFIG`.

### Local development

For local development, the public folder is served by the dev server which gives access to `/env.js`. This allows us to easily modify our `env.js` file, for example to change a host to point to a local backend.

### Deployed environments

For deployed environmnents, the `env.js` file is generated in the deployment pipeline and deployed alongside the app bundle. The values are taken from the Azure DevOps Library. We use an Azure Pipelines "Task" [ReplaceTokens](https://marketplace.visualstudio.com/items?itemName=qetza.replacetokens). See the `.pipelines/deploy-job` for how this is implemented.

## Feature Flags

We use our own feature flag implementation which is quite basic - we should look to improve how we do this in the future.

Feature flags are stored in Azure App Configuration and exposed to our frontend applications via an endpoint on the Orders Service.

We use Tanstack Query to cache these feature flags and make them available throughout the app using `FeatureFlagsContext`, `FeatureFlagsProvider` and the `useFeatureFlags` hook.

Adding and removing flags is done via JSON files in the Orders Service repository. This requires a pull request/merge for any feature flag change.

The app makes two requests for feature flags: one to the Orders Service which contains the live feature flags, and second one to a local `features.json` file in the web server root. This second one can be used to override flags for local development.

### Local development

For local development, we always get the dev feature flags set from the request to the Orders Service. Additionally, we can define feature flags in `/public/features.json` which can override these flags. This JSON file contains an array of strings - these will be added to the feature flags list unless the string starts with `-` in which case the feature flag is removed from the live set.

### Deployed environments

For deployed environments, the second request will fail with a 404 and this error is ignored, leaving only the live feature flags to be loaded.

## Startup

Startup is standard Vite setup - `main.tsx` is the entry point which loads the React app into the DOM and defines the Providers used to provide cross-cutting functionality to the app.

We have a simple `AppProviders` component which helps us keep our provider setup easy to read and maintain, and also helps us set up a test harness in a clear and easy way.

The various providers are stored in the `services` folder where we've colocated as much as we can - for example a lot of the network code is together in `services/api`.

The `<App />` component defined in `App.tsx` is the main application component and it is really just the router which is the backbone of the app.

## Routing

We use React Router (framework mode) as our router. It's main job is to decide which page/components to load based on the app URL.

The key features of the router we are using at the moment is "Outlets" which lets us re-use logic and layout across pages:

- e.g. `<ProtectedRoute />` lets us re-use our access logic on every protected page
- e.g. `<Layout />` lets us re-use the header-content layout on all relevant pages

There are many more features available in react-router which we should explore.

## Auth

We use Auth0 and the Auth0 React SDK to manage authentication in our apps.

Access logic is done in the `<ProtectedRoute />` component. The Auth0 React SDK makes this quite simple - we can check to see if the user is authenticated (existence of the `user` object) and what their role is (by reading the role property from the `user` object) and handle unauthenticated and unauthorised scenarios appropriately.

## API Requests

We have a fairly sophisticated pattern for making network requests which is documented separately - [see here](/src/services/api/README.md) for a detailed explanation of how this works

The pattern allows us to write our network requests in the `/services/api/apis` folder. This pattern gives us:

- allows us to make network requests without drilling the `getAccessTokenSilently` through our components
- a place to group related network requests into "domain specific APIs" e.g. `/services/api/apis/orderApi`
- a place to compose our "domain specific APIs" into a root API e.g. `/services/api/apis/rootApi`
- access to the root API client by using the `useApi` hook

For GET requests, we should use Tanstack Query (see next section) to make our network requests - that way we can defer the decision of making a fresh request vs re-using a cached response to Tanstack Query in a consistent way.

For POST/PUT/DELETE etc, you can use Tanstack Query mutations or just make the requets manually using `useApi`, whichever makes most sense in the situation.

In general, if we're making a POST/PUT/DELETE on data that we have in our cache, we should consider mutations as that way we can update our cache and make the request to update the server state at the same time, and also do nice things like have optimistic updates and rollback.

See here for more information on optimistic updates:

- [blog post on optimistic updates](https://medium.com/@kyledeguzmanx/what-are-optimistic-updates-483662c3e171)
- [tanstack query docs](https://tanstack.com/query/v4/docs/framework/react/guides/optimistic-updates)

## Caching / Server-side state

We use Tanstack Query for caching and storing server-side state. I think Tanstack Query is often associated with network requests, but really it's just a caching library for managing async state. In most cases, the async state we care about is server-side state e.g. data that lives in the database(s) in our backend - Orders, Customers, Products etc.

For a lot of requests, we don't want to cache it and want live updates any time the app requests it. For other requests, we might want to cache quite aggressively (such as a request that many pages are making, and we want to avoid re-fetching as we navigate through pages of the app).

In the spirit of [colocation](https://kentcdodds.com/blog/colocation), we've kept all of the Tanstack Query stuff together in the `services/cache` folder - with the usual React provider code as well as the individual queries themselves (which are in `services/cache/queries`).

I suggest all GET requests are wrapped in a query so that we can efficiently manage the network calls using the cache functionality.

This works nicely with our "API Client" code described above, we can have:

```js
// services/queries/useOrdersQuery.ts
export function useOrdersQuery() {
  const api = useApi();

  return useQuery({
    queryKey: ['orders'],
    queryFn: () => api.fetchOrders(),
  });
}

// pages/Orders/Orders.tsx
export function Orders() {
  const { data: orders = [], isPending } = useOrdersQuery();

  // rest of implementation
}
```

## UI Library

We use Chakra as our UI library, however we don't want to couple our whole app to chakra as this makes updgrading painful and can result in inconsistent UIs as we start to leverage different Chakra functionality/styles in different places.

Insted, we want to set up some layers to decouple our app from chakra, encourage better re-use, easier testing and discovery via storybook.

A good starting point:

| Folder                     | Convention                                                            |
| -------------------------- | --------------------------------------------------------------------- |
| `components/lib`           | contains our own design system / ui primitives - generic stuff only   |
| `components/shared`        | contains domain-specific components which are used in multiple places |
| `/pages/<page>/components` | contains domain-specific components which are only used in one page   |

We should use Storybook to build our components in isolation before integrating them into our app - this ensures we keep our components loosely coupled and improves discoverability of what components we have, helping us avoid creating copies of the same component.

An example:

Let's say you're working on new page which has a complex component in it. As far as we know, this component is only needed for this new page.

I would start by doing some planning: break down the design into components. This would involve identifying (1) which components need to be built, and (2) whether they are generic or domain-specific.

I'd look at the storybook and see if any of the components already exist - if not, I'd build the generic stuff in `components/lib` and add storybook stories so that they are visible to the next person working in the codebase.

Then I'd create my domain-specific component in `pages/<new-page>/components`, using the generic components as needed. I'd also add stories for this as standard practice, and probably tests too.

Later, if I wanted to re-use this component in another page, I would "lift up" the component into the `components/shared` folder and fix the imports so that both pages are importing from the shared folder.

In this way, most of our components should live in these 3 folders.

I would advise always creating components in folders, not just files, that way you have an area to put tests, split out smaller components and add custom hooks etc.

## Analytics and Observability

We use PostHog for user analytics and exception monitoring. PostHog will only be running if the keys exist in the environment variables.

If you don't have an account to access PostHog speak with the team to get one set up.

[Click here to access the main analytics dashboard](https://eu.posthog.com/project/65999)

[Click here to access error reporting dashboard](https://eu.posthog.com/project/65999/error_tracking)

## Testing

We use [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and [Mock Service Worker](https://mswjs.io/) as our main testing tools. If you haven't read through these docs before - take some time to read through them.

Currently we are not writing our own end-to-end tests but our QA group are writing end-to-end tests with Playwright.

Our testing strategy should follow that of the [testing trophy](https://www.franciscomoretti.com/blog/what-tests-to-write-for-react) - that is to say we should favour "integration tests" over anything else.

That really means we should be looking to use mocking sparingly - the more we mock, the less code we put under test.

Mock Service Worker helps us a lot here - it means we don't need to mock HTTP requests, instead we keep all of that code under test and we intercept the HTTP responses with the mock service worker. It let's us set up mock responses for our tests.

Some guidelines for writing tests that are actually fun to work with:

- follow the pattern: [arrange, act, assert](https://automationpanda.com/2020/07/07/arrange-act-assert-a-pattern-for-writing-good-tests/)
- test **what** the code does, not **how** it does it
  - for user interfaces that generally means **make assertions on the DOM**, and avoid making assertions on things like state, and other details that are not visible to the user
- avoid abstraction and indirection in tests
  - keep the reader in your test function, don't have them jumping around to figure out what's being tested
  - be considered when you want to keep things DRY (this hides details and makes the tests less clear)
  - use helper functions sparingly
  - [read this article for more great advice](https://mtlynch.io/good-developers-bad-tests/)

In our testing setup, the AppProviders utility makes things quite nice. We can just use the exact same AppProviders setup and mock the <Auth0Provider />`. Now we have a realistic test harness.

One thing we are missing right now is a test router.

... what else?

## State Management

State management is where things get tricky and the first thing to consider is: what kind of state am I working with?

It helps to think a bit more deeply about what we mean by "state" and use the best tool for the job.

| type              | description                               | recommended tool                |
| ----------------- | ----------------------------------------- | ------------------------------- |
| server-side state | data which you load into the app          | tanstack query                  |
| ui state          | isOpen, selectedTab etc                   | react hooks                     |
| form state        | forms, data that the user is working with | formik (or whatever is new now) |
| application state | state which is unique to the client       | react hooks, redux/zustand\*    |

Most applications don't actually have much true "application state", they tend to provide an interface to server-side state.

"Do the simplest thing that could possibly work"

## Pipelines, infrastructure and deployment

We use Azure Pipelines for CI/CD, running a simple build and test stage and then deployment stages for each environment (dev, preprod and prod).

We use Azure Static Web Apps to host the apps, using Custom Domains and AWS Route53 for DNS.
