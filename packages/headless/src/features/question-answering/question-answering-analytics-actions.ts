import {validatePayload} from '../../utils/validate-payload';
import {
  AnalyticsType,
  makeAnalyticsActionWithDescription,
} from '../analytics/analytics-utils';
import {
  documentIdentifierPayloadDefinition,
  QuestionAnsweringDocumentIdActionCreatorPayload,
} from './question-answering-document-id';

export const logExpandSmartSnippet = () =>
  makeAnalyticsActionWithDescription(
    'analytics/smartSnippet/expand',
    AnalyticsType.Custom,
    (client) => client.buildExpandSmartSnippet()
  );

export const logCollapseSmartSnippet = () =>
  makeAnalyticsActionWithDescription(
    'analytics/smartSnippet/collapse',
    AnalyticsType.Custom,
    (client) => client.buildCollapseSmartSnippet()
  );

export const logLikeSmartSnippet = () =>
  makeAnalyticsActionWithDescription(
    'analytics/smartSnippet/like',
    AnalyticsType.Custom,
    (client) => client.buildLikeSmartSnippet()
  );

export const logDislikeSmartSnippet = () =>
  makeAnalyticsActionWithDescription(
    'analytics/smartSnippet/dislike',
    AnalyticsType.Custom,
    (client) => client.buildDislikeSmartSnippet()
  );

export const logExpandSmartSnippetSuggestion = (
  payload: QuestionAnsweringDocumentIdActionCreatorPayload
) =>
  makeAnalyticsActionWithDescription(
    'analytics/smartSnippetSuggestion/expand',
    AnalyticsType.Custom,
    (client) => {
      validatePayload(payload, documentIdentifierPayloadDefinition());
      return client.buildExpandSmartSnippetSuggestion(payload);
    }
  );

export const logCollapseSmartSnippetSuggestion = (
  payload: QuestionAnsweringDocumentIdActionCreatorPayload
) =>
  makeAnalyticsActionWithDescription(
    'analytics/smartSnippetSuggestion/expand',
    AnalyticsType.Custom,
    (client) => {
      validatePayload(payload, documentIdentifierPayloadDefinition());
      return client.buildCollapseSmartSnippetSuggestion(payload);
    }
  );
