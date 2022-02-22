import {
  AnalyticsType,
  makeAnalyticsActionWithDescription,
} from '../analytics/analytics-utils';

export const logRedirection = () =>
  makeAnalyticsActionWithDescription(
    'analytics/redirection',
    AnalyticsType.Search,
    (client, state) => {
      return client.buildTriggerRedirect({
        redirectedTo: state.redirection?.redirectTo || '',
      });
    }
  );
