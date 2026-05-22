window.ENV_CONFIG = {
  auth0: {
    audience: '#{auth0.audience}#',
    clientId: '#{auth0.client_id}#',
    domain: '#{auth0.domain}#',
  },
  keys: {
    posthogKey: '#{keys.posthog_key}#',
    posthogHost: '#{keys.posthog_host}#',
  },
  hosts: {
    orders: '#{hosts.orders}#',
  },
  urls: {
    toolkitHomepage: '#{urls.toolkit_homepage}#',
  },
};
