# Service: API

We have a fairly technical implementation of an API Client which we can make available to our app through the `useApi` hook.

It's written in a functional style (uses higher order functions and closures) which can be a bit tricky if you haven't worked with these concepts before.

The reason it's implemented like this is that we have the following constraints:

- we can only get the access token from the Auth0 hook `useAuth0`
- we get the access token from the function `getAccessTokenSilently` which is async and we
- we don't want to have to call the hook and pass this function all over the codebase

Our implementation involves heavy use of "higher-order functions" which are just functions which return other functions. In this setup, the "inner" function will always remember the "outer" function's variables/scope - this "remembering" of scope is called a "closure".

I'll walk through a simplified example below and then show the real thing at the end.

The key thing we want to get out of this is to be able to call our fetch code and be able to add our access token to our HTTP requests, without havving to pass `getAccessTokenSilently` around.

We define our first higher-order function `createApiClient` (outer) which takes the `getAccessTokenSilently` method, and returns an object containing the `fetchHelper` (inner) function.

We need to call `createApiClient` once, passing in `getAccessTokenSilently`, and we get out our `apiClient` object which contains `apiClient.fetchHelper`. Now any time we call the `apiClient.fetchHelper` function, the `getAccessTokenSilently` will be accessible as it exists in the closure that was created when `fetchHelper` was initialised.

This is the powerful thing about closures - "inner" functions remember there scope even when the "outer" functions have finished executing.

Some example pseudo-code - for real implementation look at the `services/api` folder.

We set up the closure by defining our higher-order function:

```js
export const createApiClient = (getAccessTokenSilently) => {
  async function fetchHelper(request) {
    const accessToken = await getAccessTokenSilently();

    request.headers.append('Authorization', `Bearer ${accessToken}`);

    // rest of implementation of fetch code
  }

  return { fetchHelper };
};
```

Here we have accomplished what we want - we can call `apiClient.fetchHelper` without having to pass in the token. The catch is, we need to call `createApiClient` first.

Now we can do:

```js
const { getAccessTokenSilently } = useAuth0();

// do this once when we bootstrap the app
const apiClient = createApiClient(getAccessTokenSilently);

// now we can do this anywhere without having to pass the token in!
const request = new Request('my-endpoint');
apiClient.fetchHelper(request);
```

How we hook this into our app is as follows - define a context, provider and hook:

```js
const ApiContext = createContext(null);

export function ApiProvider({ children }) {
  const { getAccessTokenSilently } = useAuth0();

  const api = createApiClient(getAccessTokenSilently),

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}

function useApi() {
  const api = useContext(ApiContext);

  return api;
}
```

And now in our components we can do:

```js
function MyComponent() {
  const api = useApi();

  api.fetchHelper();
}
```

But, we don't stop there. There are two additional quality of life improvements:

1. creating an "api layer" so that we don't have to set up calls to `fetchHelper` in our components
1. use React Query's queries to simplify this even further (this will be covered in the next section on caching)

The first pattern is implemented by with another higher-order function:

```js
export const createOrderApi = (apiClient) => ({
  fetchOrder: async () => {
    const request = new Request(getOrdersEndpoint());
    return apiClient.fetchHelper(request);
  },
});
```

We create domain-specific "api" objects (e.g. `orderApi`, `productApi`, `customerApi`) using more higher-order functions.

Again, an inner function is returned, and this inner function (`fetchOrder`) remembers the outer function's scope, giving it access to the `apiClient` variable.

Now you can just do:

```js
// do once when bootstrapping app
const apiClient = createApiClient(getAccessTokenSilently);

// do once when bootstrapping app
const orderApi = createOrderApi(apiClient);

// then later you can do this - no need to pass any token/client params!
orderApi.fetchOrder();
```

The last piece of this is composition - we can compose all of our api objects into one `rootApi` object. You may wonder where we get `getAccessTokenSilently` from in the above example - it's another higher-order function!

```js
export function createRootApi(getAccessTokenSilently) {
  const apiClient = createApiClient(getAccessTokenSilently);

  return {
    ...createFeatureFlagsApi(apiClient),
    ...createStatusApi(apiClient),
    ...createOrderApi(apiClient),
    // ... add more domain APIs here
  };
}
```

Pulling it all together, we have:

`ApiProvider` - this gets `getAccessTokenSilently` from the `useAuth0` hook and passes it into `createRootApi`. The resulting API object is then put into the `ApiContext` and is available throughout the app.

```tsx
// ApiProvider.tsx
export function ApiProvider({ children }: GenericProviderProps) {
  const { getAccessTokenSilently } = useAuth0();

  const api = useMemo(
    () => createRootApi(getAccessTokenSilently),
    [getAccessTokenSilently],
  );

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
}
```

This `api` object will evenutally look something like below, once you start to add your APIs.

```js
{
  fetchOrder,
  updateOrderStatus,
  fetchCustomer,
  // etc
}
```

`createRootApi` will create the `apiClient` object using `getAccessTokenSilently`, and pass this into each of the "domain specific APIs" e.g. `createOrderApi`.

```ts
export function createRootApi(getAccessTokenSilently: () => Promise<string>) {
  const apiClient = createApiClient(getAccessTokenSilently);

  return {
    ...createFeatureFlagsApi(apiClient),
    ...createStatusApi(apiClient),
    ...createOrderApi(apiClient),
    // ... add more domain APIs here
  };
}
```

The domain specific APIs will pass use the `apiClient` to make the call, without having to pass in the access token since it was remembered from when the `apiClient` was initialised.

```ts
export function createOrderApi(apiClient: ReturnType<typeof createApiClient>) {
  return {
    fetchOrder: async (): Promise<IOrderResponse> => {
      const request = new Request(getOrdersEndpoint());
      return apiClient.fetchHelper<IOrderResponse>(request);
    },
  };
}
```

This approach is quite technical, however the tradeoff is that we make this code a bit more sophisticated in order to make network code throughout the application a lot more simple.
