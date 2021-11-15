import {
  SearchConfigurationSection,
  ContextSection,
  DictionaryFieldContextSection,
  ProductRecommendationsSection,
  SearchHubSection,
  VersionSection,
} from './state-sections';

export type ProductRecommendationsAppState = SearchConfigurationSection &
  ProductRecommendationsSection &
  ContextSection &
  DictionaryFieldContextSection &
  SearchHubSection &
  VersionSection;
