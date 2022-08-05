import {ProductListingAPIErrorStatusResponse} from '../../api/commerce/product-listings/product-listing-api-client';
import {ProductRecommendation} from '../../api/search/search/product-recommendation';
import {AnyFacetResponse} from '../facets/generic/interfaces/generic-facet-response';

export interface Slug {
  segmentField0: string;
  segmentField1?: string;
  segmentField2?: string;
  segmentField3?: string;
}

export interface Routing {
  rootUrl: string;
  slug: Slug;
}

export interface ProductListingState {
  url: string;
  clientId: string;
  additionalFields: string[];
  advancedParameters: {
    debug: boolean;
  };
  products: ProductRecommendation[];
  facets: {
    results: AnyFacetResponse[];
  };
  error: ProductListingAPIErrorStatusResponse | null;
  isLoading: boolean;
  responseId: string;
  routing: Routing | null;
}

export const getProductListingInitialState = (): ProductListingState => ({
  url: '',
  clientId: '',
  additionalFields: [],
  advancedParameters: {
    debug: false,
  },
  products: [],
  facets: {
    results: [],
  },
  error: null,
  isLoading: false,
  responseId: '',
  routing: null,
});
