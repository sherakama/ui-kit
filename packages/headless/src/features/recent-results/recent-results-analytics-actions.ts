import {Result} from '../../api/search/search/result';
import {
  AnalyticsType,
  partialDocumentInformation,
  documentIdentifier,
  validateResultPayload,
  makeAnalyticsActionWithDescription,
} from '../analytics/analytics-utils';

export const logRecentResultClickThunk = (result: Result) =>
  makeAnalyticsActionWithDescription(
    'analytics/recentResults/click',
    AnalyticsType.Custom,
    (client, state) => {
      validateResultPayload(result);
      return client.buildRecentResultClick(
        partialDocumentInformation(result, state),
        documentIdentifier(result)
      );
    }
  );

export const logRecentResultClick = (result: Result) =>
  logRecentResultClickThunk(result);

export const logClearRecentResults = () =>
  makeAnalyticsActionWithDescription(
    'analytics/recentResults/clear',
    AnalyticsType.Custom,
    (client) => client.buildClearRecentResults()
  );
