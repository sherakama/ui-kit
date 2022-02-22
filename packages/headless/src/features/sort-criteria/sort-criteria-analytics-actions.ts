import {
  AnalyticsType,
  makeAnalyticsActionWithDescription,
} from '../analytics/analytics-utils';
import {getSortCriteriaInitialState} from './sort-criteria-state';

export const logResultsSort = () =>
  makeAnalyticsActionWithDescription(
    'analytics/sort/results',
    AnalyticsType.Search,
    (client, state) =>
      client.buildResultsSort({
        resultsSortBy: state.sortCriteria || getSortCriteriaInitialState(),
      })
  );
