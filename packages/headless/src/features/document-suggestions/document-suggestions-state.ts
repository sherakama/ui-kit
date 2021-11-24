import {CaseAssistAPIErrorStatusResponse} from '../../api/service/case-assist/case-assist-api-client';
import {DocumentSuggestion} from '../../api/service/case-assist/get-document-suggestions/get-document-suggestions-response';

export const getDocumentSuggestionsInitialState =
  (): DocumentSuggestionsState => ({
    enabled: false,
    status: {
      loading: false,
      error: null,
      lastResponseId: '',
    },
    documents: [],
  });

export interface DocumentSuggestionsStatus {
  /**
   * `true` if a request is in progress and `false` otherwise.
   */
  loading: boolean;
  /**
   * The Case Assist API error response.
   */
  error: CaseAssistAPIErrorStatusResponse | null;
  /**
   * The ID of the response.
   */
  lastResponseId: string;
}

export interface DocumentSuggestionsState {
  /**
   * Specifies if the automatic update of document suggestions should be enabled.
   * By default the feature is disabled.
   */
  enabled: boolean;
  /**
   * The status of the document suggestions request.
   */
  status: DocumentSuggestionsStatus;
  /**
   * The retrieved document suggestions.
   */
  documents: DocumentSuggestion[];
}
