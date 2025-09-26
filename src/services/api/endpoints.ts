const ordersServiceHost = window.ENV_CONFIG.hosts.orders;

// prettier-ignore
export const getRemoteFeatureFlagsEndpoint = () => `${ordersServiceHost}/api/v3/feature-flags`;
export const getLocalFeatureFlagsEndpoint = () => './features.json';
export const getStatusEndpoint = () => `${ordersServiceHost}/api/v1-0/status`;
export const getOrdersEndpoint = () => `${ordersServiceHost}/api/v3/orders`;
