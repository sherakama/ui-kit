import {Result} from '../../api/search/search/result';
import {
  AnalyticsType,
  documentIdentifier,
  makeAnalyticsActionWithDescription,
  partialRecommendationInformation,
  validateResultPayload,
} from '../analytics/analytics-utils';

export const logRecommendationUpdate = () =>
  makeAnalyticsActionWithDescription(
    'analytics/recommendation/update',
    AnalyticsType.Search,
    (client) => client.buildRecommendationInterfaceLoad()
  );

export const logRecommendationOpen = (result: Result) =>
  makeAnalyticsActionWithDescription(
    'analytics/recommendation/open',
    AnalyticsType.Click,
    (client, state) => {
      validateResultPayload(result);
      return client.buildRecommendationOpen(
        partialRecommendationInformation(result, state),
        documentIdentifier(result)
      );
    }
  );
