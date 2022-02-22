import {
  partialDocumentInformation,
  documentIdentifier,
  validateResultPayload,
  AnalyticsType,
  makeAnalyticsActionWithDescription,
} from '../analytics/analytics-utils';
import {Result} from '../../api/search/search/result';

export const logDocumentOpenThunk = (result: Result) =>
  makeAnalyticsActionWithDescription(
    'analytics/result/open',
    AnalyticsType.Click,
    (client, state) => {
      validateResultPayload(result);
      return client.buildDocumentOpen(
        partialDocumentInformation(result, state),
        documentIdentifier(result)
      );
    }
  );

export const logDocumentOpen = (result: Result) => logDocumentOpenThunk(result);
