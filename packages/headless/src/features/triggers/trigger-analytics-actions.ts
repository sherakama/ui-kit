import {
  AnalyticsType,
  makeAnalyticsActionWithDescription,
} from '../analytics/analytics-utils';

export const logTriggerQuery = () =>
  makeAnalyticsActionWithDescription(
    'analytics/trigger/query',
    AnalyticsType.Search,
    (client) => {
      return client.buildTriggerQuery();
    }
  );

export const logNotifyTrigger = () =>
  makeAnalyticsActionWithDescription(
    'analytics/trigger/notify',
    AnalyticsType.Search,
    (client, state) => {
      return client.buildTriggerNotify({
        notification: state.triggers?.notification || '',
      });
    }
  );

export const logTriggerRedirect = () =>
  makeAnalyticsActionWithDescription(
    'analytics/trigger/redirect',
    AnalyticsType.Search,
    (client, state) => {
      return client.buildTriggerRedirect({
        redirectedTo: state.triggers?.redirectTo || '',
      });
    }
  );

/**
 * Log trigger execute
 */
export const logTriggerExecute = () =>
  makeAnalyticsActionWithDescription(
    'analytics/trigger/execute',
    AnalyticsType.Search,
    (client, state) => {
      return client.buildTriggerExecute({
        executed: state.triggers?.execute.functionName || '',
      });
    }
  );
