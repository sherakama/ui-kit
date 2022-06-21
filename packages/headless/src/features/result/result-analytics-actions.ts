import {
  partialDocumentInformation,
  documentIdentifier,
  validateResultPayload,
  makeAnalyticsAction,
  AnalyticsType,
} from '../analytics/analytics-utils';
import {Result} from '../../api/search/search/result';

export const logDocumentOpenThunk = (result: Result, location?: string) =>
  makeAnalyticsAction(
    'analytics/result/open',
    AnalyticsType.Click,
    (client, state) => {
      validateResultPayload(result);
      return client.logDocumentOpen(
        partialDocumentInformation(result, state),
        documentIdentifier(result),
        location ? {location} : undefined
      );
    }
  );

export const logDocumentOpen = (result: Result, location?: string) => {
  return logDocumentOpenThunk(result, location)();
};
