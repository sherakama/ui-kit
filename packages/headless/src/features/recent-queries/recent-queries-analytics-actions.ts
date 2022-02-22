import {
  AnalyticsType,
  makeAnalyticsActionWithDescription,
} from '../analytics/analytics-utils';

export const logClearRecentQueries = () =>
  makeAnalyticsActionWithDescription(
    'analytics/recentQueries/clear',
    AnalyticsType.Custom,
    (client) => {
      return client.buildClearRecentQueries();
    }
  );

export const logRecentQueryClick = () =>
  makeAnalyticsActionWithDescription(
    'analytics/recentQueries/click',
    AnalyticsType.Search,
    (client) => {
      return client.buildRecentQueryClick();
    }
  );
