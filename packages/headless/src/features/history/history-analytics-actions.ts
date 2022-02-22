import {SearchPageEvents} from 'coveo.analytics/dist/definitions/searchPage/searchPageEvents';
import {
  AnalyticsType,
  makeAnalyticsActionWithDescription,
} from '../analytics/analytics-utils';

export const logNavigateForward = () =>
  makeAnalyticsActionWithDescription(
    'history/analytics/forward',
    AnalyticsType.Search,
    (client) => client.buildSearchEvent('historyForward' as SearchPageEvents) // TODO: Need to create this event natively in coveo.analytics to remove cast
  );

export const logNavigateBackward = () =>
  makeAnalyticsActionWithDescription(
    'history/analytics/backward',
    AnalyticsType.Search,
    (client) => client.buildSearchEvent('historyBackward' as SearchPageEvents) // TODO: Need to create this event natively in coveo.analytics to remove cast
  );

export const logNoResultsBack = () =>
  makeAnalyticsActionWithDescription(
    'history/analytics/noresultsback',
    AnalyticsType.Search,
    (client) => client.buildNoResultsBack()
  );
