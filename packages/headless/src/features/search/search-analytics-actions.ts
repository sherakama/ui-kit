import {SearchAPIErrorWithStatusCode} from '../../api/search/search-api-error-response';
import {getAdvancedSearchQueriesInitialState} from '../advanced-search-queries/advanced-search-queries-state';
import {
  AnalyticsType,
  makeAnalyticsActionWithDescription,
} from '../analytics/analytics-utils';
import {getQueryInitialState} from '../query/query-state';

export const logFetchMoreResults = () =>
  makeAnalyticsActionWithDescription(
    'search/logFetchMoreResults',
    AnalyticsType.Search,
    (client) => client.buildFetchMoreResults()
  );

export const logQueryError = (error: SearchAPIErrorWithStatusCode) =>
  makeAnalyticsActionWithDescription(
    'search/queryError',
    AnalyticsType.Search,
    (client, state) =>
      client.buildQueryError({
        query: state.query?.q || getQueryInitialState().q,
        aq:
          state.advancedSearchQueries?.aq ||
          getAdvancedSearchQueriesInitialState().aq,
        cq:
          state.advancedSearchQueries?.cq ||
          getAdvancedSearchQueriesInitialState().cq,
        // TODO: add dq when its added to advanced queries
        dq: '',
        errorType: error.type,
        errorMessage: error.message,
      })
  );
