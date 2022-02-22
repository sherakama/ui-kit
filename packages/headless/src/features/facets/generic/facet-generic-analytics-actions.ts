import {
  AnalyticsType,
  makeAnalyticsActionWithDescription,
} from '../../analytics/analytics-utils';

export const logClearBreadcrumbs = () =>
  makeAnalyticsActionWithDescription(
    'analytics/facet/deselectAllBreadcrumbs',
    AnalyticsType.Search,
    (client) => {
      return client.buildBreadcrumbResetAll();
    }
  );
