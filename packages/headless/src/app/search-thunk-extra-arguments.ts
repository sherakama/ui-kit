import {CoveoSearchPageClient} from 'coveo.analytics';
import {AnalyticsClientFactory} from '../api/analytics/search-analytics';
import {SearchAPIClient} from '../api/search/search-api-client';
import {ClientThunkExtraArguments} from './thunk-extra-arguments';

export type SearchClientThunkExtraArguments = ClientThunkExtraArguments<
  SearchAPIClient,
  AnalyticsClientFactory<CoveoSearchPageClient>
>;

export interface SearchThunkExtraArguments
  extends SearchClientThunkExtraArguments {
  /**
   * @deprecated - The `searchAPIClient` property is now `apiClient`.
   */
  searchAPIClient: SearchAPIClient;
}
