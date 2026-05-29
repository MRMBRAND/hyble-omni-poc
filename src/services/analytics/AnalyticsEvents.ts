export const AnalyticsEvents = {
  OMNI_AI_CHAT_START: 'omni:embedded:ai:chat-start_v1',
  OMNI_DASHBOARD_DOWNLOAD: 'omni:embedded:dashboard:download_v1',
  OMNI_DASHBOARD_FILTER_CHANGED: 'omni:embedded:dashboard:filter-changed_v1',
  OMNI_DASHBOARD_FILTERS: 'omni:embedded:dashboard:filters_v1',
  OMNI_DASHBOARD_TILE_DOWNLOAD: 'omni:embedded:dashboard:tile-download_v1',
  OMNI_DASHBOARD_TILE_DRILL: 'omni:embedded:dashboard:tile-drill_v1',
  OMNI_ERROR: 'omni:embedded:error_v1',
  OMNI_NAVIGATION_HOME: 'omni:embedded:navigation:home_v1',
  OMNI_PAGE_CHANGED: 'omni:embedded:page:changed_v1',
  OMNI_SIDEBAR_OPEN: 'omni:embedded:sidebar:open_v1',
  OMNI_DASHBOARD_OPENED: 'omni:embedded:dashboard_opened_v1',
} as const;

export const OMNI_EVENT_MAP: Record<string, string> = {
  'ai:chat-start': AnalyticsEvents.OMNI_AI_CHAT_START,
  'dashboard:download': AnalyticsEvents.OMNI_DASHBOARD_DOWNLOAD,
  'dashboard:filter-changed': AnalyticsEvents.OMNI_DASHBOARD_FILTER_CHANGED,
  'dashboard:filters': AnalyticsEvents.OMNI_DASHBOARD_FILTERS,
  'dashboard:tile-download': AnalyticsEvents.OMNI_DASHBOARD_TILE_DOWNLOAD,
  'dashboard:tile-drill': AnalyticsEvents.OMNI_DASHBOARD_TILE_DRILL,
  error: AnalyticsEvents.OMNI_ERROR,
  'navigation:home': AnalyticsEvents.OMNI_NAVIGATION_HOME,
  'page:changed': AnalyticsEvents.OMNI_PAGE_CHANGED,
  'sidebar:open': AnalyticsEvents.OMNI_SIDEBAR_OPEN,
};
