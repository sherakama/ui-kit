import {makeAnalyticsActionWithDescription} from '../analytics/analytics-utils';
import {AnalyticsType} from '../analytics/analytics-utils';

export const logSearchboxSubmit = () =>
  makeAnalyticsActionWithDescription(
    'analytics/searchbox/submit',
    AnalyticsType.Search,
    (client) => client.buildSearchboxSubmit()
  );
