import {
  AdvancedSearchQueriesSection,
  SearchConfigurationSection,
  ContextSection,
  DebugSection,
  DictionaryFieldContextSection,
  FieldsSection,
  PipelineSection,
  RecommendationSection,
  SearchHubSection,
  VersionSection,
} from './state-sections';

export type RecommendationAppState = SearchConfigurationSection &
  FieldsSection &
  AdvancedSearchQueriesSection &
  ContextSection &
  DictionaryFieldContextSection &
  PipelineSection &
  SearchHubSection &
  DebugSection &
  RecommendationSection &
  VersionSection;
