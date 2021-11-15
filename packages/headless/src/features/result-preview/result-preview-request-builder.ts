import {getVisitorID} from '../../api/analytics/analytics';
import {
  HtmlRequest,
  HtmlRequestOptions,
} from '../../api/search/html/html-request';
import {
  SearchConfigurationSection,
  QuerySection,
  ResultPreviewSection,
} from '../../state/state-sections';

export type StateNeededByHtmlEndpoint = SearchConfigurationSection &
  ResultPreviewSection &
  Partial<QuerySection>;

export async function buildResultPreviewRequest(
  state: StateNeededByHtmlEndpoint,
  options: HtmlRequestOptions
): Promise<HtmlRequest> {
  const {search, accessToken, organizationId, analytics} = state.configuration;
  const q = state.query?.q || '';

  return {
    url: search.apiBaseUrl,
    accessToken,
    organizationId,
    enableNavigation: false,
    ...(analytics.enabled && {
      visitorId: await getVisitorID(),
    }),
    q,
    ...options,
    requestedOutputSize: options.requestedOutputSize || 0,
  };
}
