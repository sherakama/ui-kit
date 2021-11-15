import {
  CategoryFacetSearchSection,
  CategoryFacetSection,
  SearchConfigurationSection,
  DateFacetSection,
  FacetOptionsSection,
  FacetOrderSection,
  FacetSearchSection,
  FacetSection,
  NumericFacetSection,
  PaginationSection,
  ProductListingSection,
  StructuredSortSection,
  VersionSection,
} from './state-sections';

export type ProductListingAppState = SearchConfigurationSection &
  ProductListingSection &
  FacetSearchSection &
  FacetSection &
  NumericFacetSection &
  CategoryFacetSection &
  CategoryFacetSearchSection &
  DateFacetSection &
  FacetOptionsSection &
  FacetOrderSection &
  StructuredSortSection &
  PaginationSection &
  VersionSection;
