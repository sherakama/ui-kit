import {
  CategoryFacetSearchSection,
  CategoryFacetSection,
  SearchConfigurationSection,
  FacetSearchSection,
  FacetSection,
} from '../../../../state/state-sections';

export type StateNeededForSpecificFacetSearch = SearchConfigurationSection &
  FacetSearchSection &
  FacetSection;

export type StateNeededForCategoryFacetSearch = SearchConfigurationSection &
  CategoryFacetSearchSection &
  CategoryFacetSection;

export type StateNeededForFacetSearch = SearchConfigurationSection &
  Partial<
    StateNeededForSpecificFacetSearch & StateNeededForCategoryFacetSearch
  >;
