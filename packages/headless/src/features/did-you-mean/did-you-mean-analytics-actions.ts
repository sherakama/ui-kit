import {
  AnalyticsType,
  makeAnalyticsActionWithDescription,
} from '../analytics/analytics-utils';

export const logDidYouMeanClick = () =>
  makeAnalyticsActionWithDescription(
    'analytics/didyoumean/click',
    AnalyticsType.Search,
    (client) => client.buildDidYouMeanClick()
  );

export const logDidYouMeanAutomatic = () =>
  makeAnalyticsActionWithDescription(
    'analytics/didyoumean/automatic',
    AnalyticsType.Search,
    (client) => client.buildDidYouMeanAutomatic()
  );
