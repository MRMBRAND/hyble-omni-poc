declare global {
  interface Window {
    ENV_CONFIG: EnvConfig;
  }
}

export interface EnvConfig {
  auth0: {
    audience: string;
    clientId: string;
    domain: string;
  };
  hosts: {
    orders: string;
    featureFlags: string;
  };
  urls: {
    toolkitHomepage: string;
  };
  keys: {
    posthog_key: string;
    posthog_host: string;
  };
}
