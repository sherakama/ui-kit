import {PaginationSection} from '../../state/state-sections';
import {
  AnalyticsType,
  makeAnalyticsActionWithDescription,
} from '../analytics/analytics-utils';
import {currentPageSelector} from './pagination-selectors';
import {getPaginationInitialState} from './pagination-state';

export const logPagerResize = () =>
  makeAnalyticsActionWithDescription(
    'analytics/pager/resize',
    AnalyticsType.Search,
    (client, state) =>
      client.buildPagerResize({
        currentResultsPerPage:
          state.pagination?.numberOfResults ||
          getPaginationInitialState().numberOfResults,
      })
  );

export const logPageNumber = () =>
  makeAnalyticsActionWithDescription(
    'analytics/pager/number',
    AnalyticsType.Search,
    (client, state) =>
      client.buildPagerNumber({
        pagerNumber: currentPageSelector(state as PaginationSection),
      })
  );

export const logPageNext = () =>
  makeAnalyticsActionWithDescription(
    'analytics/pager/next',
    AnalyticsType.Search,
    (client, state) =>
      client.buildPagerNext({
        pagerNumber: currentPageSelector(state as PaginationSection),
      })
  );

export const logPagePrevious = () =>
  makeAnalyticsActionWithDescription(
    'analytics/pager/previous',
    AnalyticsType.Search,
    (client, state) =>
      client.buildPagerPrevious({
        pagerNumber: currentPageSelector(state as PaginationSection),
      })
  );
