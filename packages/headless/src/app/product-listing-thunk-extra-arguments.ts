import {CoveoSearchPageClient} from 'coveo.analytics';
import {AnalyticsClientFactory} from '../api/analytics/search-analytics';
import {ProductListingAPIClient} from '../api/commerce/product-listings/product-listing-api-client';
import {ClientThunkExtraArguments} from './thunk-extra-arguments';

export interface ProductListingThunkExtraArguments
  extends ClientThunkExtraArguments<
    ProductListingAPIClient,
    AnalyticsClientFactory<CoveoSearchPageClient>
  > {}
