import {logClearBreadcrumbs} from '../facets/generic/facet-generic-analytics-actions';
import {
  logInterfaceChange,
  logInterfaceLoad,
  logSearchFromLink,
  logOmniboxFromLink,
} from './analytics-actions';
import {
  CustomAnalyticsPayload,
  SearchAnalyticsPayload,
} from './analytics-utils';
import {logDidYouMeanClick} from '../did-you-mean/did-you-mean-analytics-actions';
import {
  logCategoryFacetBreadcrumb,
  LogCategoryFacetBreadcrumbActionCreatorPayload,
} from '../facets/category-facet-set/category-facet-set-analytics-actions';
import {
  logFacetBreadcrumb,
  logFacetClearAll,
  logFacetDeselect,
  logFacetSelect,
  logFacetShowLess,
  logFacetShowMore,
  logFacetUpdateSort,
  LogFacetBreadcrumbActionCreatorPayload,
  LogFacetDeselectActionCreatorPayload,
  LogFacetSelectActionCreatorPayload,
  LogFacetUpdateSortActionCreatorPayload,
} from '../facets/facet-set/facet-set-analytics-actions';
import {
  logDateFacetBreadcrumb,
  LogDateFacetBreadcrumbActionCreatorPayload,
} from '../facets/range-facets/date-facet-set/date-facet-analytics-actions';
import {
  logNumericFacetBreadcrumb,
  LogNumericFacetBreadcrumbActionCreatorPayload,
} from '../facets/range-facets/numeric-facet-set/numeric-facet-analytics-actions';
import {
  logNavigateBackward,
  logNavigateForward,
  logNoResultsBack,
} from '../history/history-analytics-actions';
import {
  logPageNext,
  logPageNumber,
  logPagePrevious,
  logPagerResize,
} from '../pagination/pagination-analytics-actions';
import {logSearchboxSubmit} from '../query/query-analytics-actions';
import {
  logQuerySuggestionClick,
  LogQuerySuggestionClickActionCreatorPayload,
  OmniboxSuggestionMetadata,
} from '../query-suggest/query-suggest-analytics-actions';
import {logResultsSort} from '../sort-criteria/sort-criteria-analytics-actions';
import {
  logCollapseSmartSnippet,
  logExpandSmartSnippet,
  logDislikeSmartSnippet,
  logLikeSmartSnippet,
  logCollapseSmartSnippetSuggestion,
  logExpandSmartSnippetSuggestion,
} from '../question-answering/question-answering-analytics-actions';
import {QuestionAnsweringDocumentIdActionCreatorPayload} from '../question-answering/question-answering-document-id';
import {SearchEngine} from '../../app/search-engine/search-engine';
import {
  logStaticFilterSelect,
  logStaticFilterDeselect,
  logStaticFilterClearAll,
  LogStaticFilterToggleValueActionCreatorPayload,
  LogStaticFilterClearAllActionCreatorPayload,
  StaticFilterValueMetadata,
} from '../static-filter-set/static-filter-set-actions';

export type {
  LogCategoryFacetBreadcrumbActionCreatorPayload,
  LogFacetBreadcrumbActionCreatorPayload,
  LogFacetDeselectActionCreatorPayload,
  LogFacetSelectActionCreatorPayload,
  LogFacetUpdateSortActionCreatorPayload,
  LogDateFacetBreadcrumbActionCreatorPayload,
  LogNumericFacetBreadcrumbActionCreatorPayload,
  LogQuerySuggestionClickActionCreatorPayload,
  QuestionAnsweringDocumentIdActionCreatorPayload,
  LogStaticFilterToggleValueActionCreatorPayload,
  LogStaticFilterClearAllActionCreatorPayload,
  StaticFilterValueMetadata,
};

/**
 * The search analytics action creators.
 */
export interface SearchAnalyticsActionCreators {
  /**
   * The event to log when clearing breadcrumbs.
   *
   * @returns A dispatchable action.
   */
  logClearBreadcrumbs(): SearchAnalyticsPayload;

  /**
   * The event to log when a search interface loads for the first time.
   *
   * @returns A dispatchable action.
   */
  logInterfaceLoad(): SearchAnalyticsPayload;

  /**
   * The event to log when a search interface loads for the first time, for a user who performed a search using a standalone search box.
   *
   * @returns A dispatchable action.
   */
  logSearchFromLink(): SearchAnalyticsPayload;

  /**
   * The event to log when a search interface loads for the first time, for a user who selected a query suggestion from a standalone search box.
   *
   * @param metadata - The metadata of the clicked query suggestion that triggered the redirect.
   * @returns A dispatchable action.
   */
  logOmniboxFromLink(
    metadata: OmniboxSuggestionMetadata
  ): SearchAnalyticsPayload;

  /**
   * The event to log when a tab is selected.
   *
   * @returns A dispatchable action.
   */
  logInterfaceChange(): SearchAnalyticsPayload;

  /**
   * The event to log when a user triggers a search by clicking on a did-you-mean suggestion.
   *
   * @returns A dispatchable action.
   */
  logDidYouMeanClick(): SearchAnalyticsPayload;

  /**
   * The event to log when a category facet breadcrumb is deselected.
   *
   * @param payload - The action creator payload.
   * @returns A dispatchable action.
   */
  logCategoryFacetBreadcrumb(
    payload: LogCategoryFacetBreadcrumbActionCreatorPayload
  ): SearchAnalyticsPayload;

  /**
   * The event to log when a facet breadcrumb is deselected.
   *
   * @param payload - The action creator payload.
   * @returns A dispatchable action.
   */
  logFacetBreadcrumb(
    payload: LogFacetBreadcrumbActionCreatorPayload
  ): SearchAnalyticsPayload;

  /**
   * The event to log when all selected values in a facet are deselected.
   *
   * @param facetId - The facet id.
   * @returns A dispatchable action.
   */
  logFacetClearAll(facetId: string): SearchAnalyticsPayload;

  /**
   * The event to log when a selected facet value is deselected.
   *
   * @param payload - The action creator payload.
   * @returns A dispatchable action.
   */
  logFacetDeselect(
    payload: LogFacetDeselectActionCreatorPayload
  ): SearchAnalyticsPayload;

  /**
   * The event to log when an idle facet value is selected.
   *
   * @param payload - The action creator payload.
   * @returns A dispatchable action.
   */
  logFacetSelect(
    payload: LogFacetSelectActionCreatorPayload
  ): SearchAnalyticsPayload;

  /**
   * The event to log when shrinking a facet to show fewer values.
   *
   * @param facetId - The facet id.
   * @returns A dispatchable action.
   */
  logFacetShowLess(facetId: string): SearchAnalyticsPayload;

  /**
   * The event to log when expanding a facet to show more values.
   *
   * @param facetId - The facet id.
   * @returns A dispatchable action.
   */
  logFacetShowMore(facetId: string): SearchAnalyticsPayload;

  /**
   * The event to log when the facet sort criterion is changed.
   *
   * @param payload - The action creator payload.
   * @returns A dispatchable action.
   */
  logFacetUpdateSort(
    payload: LogFacetUpdateSortActionCreatorPayload
  ): SearchAnalyticsPayload;

  /**
   * The event to log when a date facet breadcrumb is deselected.
   *
   * @param payload - The action creator payload.
   * @returns A dispatchable action.
   */
  logDateFacetBreadcrumb(
    payload: LogDateFacetBreadcrumbActionCreatorPayload
  ): SearchAnalyticsPayload;

  /**
   * The event to log when a numeric facet breadcrumb is deselected.
   *
   * @param payload - The action creator payload.
   * @returns A dispatchable action.
   */
  logNumericFacetBreadcrumb(
    payload: LogNumericFacetBreadcrumbActionCreatorPayload
  ): SearchAnalyticsPayload;

  /**
   * The event to log when going to the previous state of the search interface.
   *
   * @returns A dispatchable action.
   */
  logNavigateBackward(): SearchAnalyticsPayload;

  /**
   * The event to log when going to the next state of the search interface.
   *
   * @returns A dispatchable action.
   */
  logNavigateForward(): SearchAnalyticsPayload;

  /**
   * The event to log when navigating to the next page of results.
   *
   * @returns A dispatchable action.
   */
  logPageNext(): SearchAnalyticsPayload;

  /**
   * The event to log when selecting a page in the pager.
   *
   * @returns A dispatchable action.
   */
  logPageNumber(): SearchAnalyticsPayload;

  /**
   * The event to log when navigating to the previous page of results.
   *
   * @returns A dispatchable action.
   */
  logPagePrevious(): SearchAnalyticsPayload;

  /**
   * The event to log when changing the number of results per page.
   *
   * @returns A dispatchable action.
   */
  logPagerResize(): SearchAnalyticsPayload;

  /**
   * The event to log when performing a search using a search box.
   *
   * @returns A dispatchable action.
   */
  logSearchboxSubmit(): SearchAnalyticsPayload;

  /**
   * The event to log when a query suggestion is selected.
   *
   * @param payload - The action creator payload.
   * @returns A dispatchable action.
   */
  logQuerySuggestionClick(
    payload: LogQuerySuggestionClickActionCreatorPayload
  ): SearchAnalyticsPayload;

  /**
   * The event to log when the results sort criterion is changed.
   *
   * @returns A dispatchable action.
   */
  logResultsSort(): SearchAnalyticsPayload;

  /**
   * The event to log when a smart snipped is collapsed.
   *
   * @returns A dispatchable action.
   */
  logCollapseSmartSnippet(): CustomAnalyticsPayload;

  /**
   * The event to log when a smart snipped is expanded.
   *
   * @returns A dispatchable action.
   */
  logExpandSmartSnippet(): CustomAnalyticsPayload;

  /**
   * The event to log when a user provides negative feedback for a given smart snippet answer.
   *
   * @returns A dispatchable action.
   */
  logDislikeSmartSnippet(): CustomAnalyticsPayload;

  /**
   * The event to log when a user provides positive feedback for a given smart snippet answer.
   *
   * @returns A dispatchable action.
   */
  logLikeSmartSnippet(): CustomAnalyticsPayload;

  /**
   * The event to log when a query suggestion is selected.
   *
   * @param payload - The action creator payload.
   * @returns A dispatchable action.
   */
  logExpandSmartSnippetSuggestion(
    payload: QuestionAnsweringDocumentIdActionCreatorPayload
  ): CustomAnalyticsPayload;

  /**
   * The event to log when a smart snippet suggestion, or related question, is collapsed.
   *
   * @param payload - The action creation payload.
   * @returns A dispatchable action.
   */
  logCollapseSmartSnippetSuggestion(
    payload: QuestionAnsweringDocumentIdActionCreatorPayload
  ): CustomAnalyticsPayload;

  /**
   * The event to log when no results is shown and the end users cancel last action.
   *
   * @param payload - The action creation payload.
   * @returns A dispatchable action.
   */
  logNoResultsBack(): SearchAnalyticsPayload;

  /**
   * The event to log when a static filter value is selected.
   *
   * @param payload - The action creation payload.
   * @returns A dispatchable action.
   */
  logStaticFilterSelect(
    payload: LogStaticFilterToggleValueActionCreatorPayload
  ): SearchAnalyticsPayload;

  /**
   * The event to log when a static filter value is deselected.
   *
   * @param payload - The action creation payload.
   * @returns A dispatchable action.
   */
  logStaticFilterDeselect(
    payload: LogStaticFilterToggleValueActionCreatorPayload
  ): SearchAnalyticsPayload;

  /**
   * The event to log when all selected values of a static filter are deselected.
   *
   * @param payload - The action creation payload.
   * @returns A dispatchable action.
   */
  logStaticFilterClearAll(
    payload: LogStaticFilterClearAllActionCreatorPayload
  ): SearchAnalyticsPayload;
}

/**
 * Returns possible search analytics action creators.
 *
 * @param engine - The headless engine.
 * @returns An object holding the action creators.
 */
export function loadSearchAnalyticsActions(
  engine: SearchEngine
): SearchAnalyticsActionCreators {
  engine.addReducers({});

  return {
    logClearBreadcrumbs,
    logInterfaceLoad,
    logSearchFromLink,
    logOmniboxFromLink,
    logInterfaceChange,
    logDidYouMeanClick,
    logCategoryFacetBreadcrumb,
    logFacetBreadcrumb,
    logFacetClearAll,
    logFacetDeselect,
    logFacetSelect,
    logFacetShowLess,
    logFacetShowMore,
    logFacetUpdateSort,
    logDateFacetBreadcrumb,
    logNumericFacetBreadcrumb,
    logNavigateBackward,
    logNavigateForward,
    logPageNext,
    logPageNumber,
    logPagePrevious,
    logPagerResize,
    logSearchboxSubmit,
    logQuerySuggestionClick,
    logResultsSort,
    logDislikeSmartSnippet,
    logLikeSmartSnippet,
    logExpandSmartSnippet,
    logCollapseSmartSnippet,
    logExpandSmartSnippetSuggestion,
    logCollapseSmartSnippetSuggestion,
    logNoResultsBack,
    logStaticFilterSelect,
    logStaticFilterDeselect,
    logStaticFilterClearAll,
  };
}
