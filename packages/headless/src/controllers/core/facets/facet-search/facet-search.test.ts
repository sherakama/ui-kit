import {
  clearFacetSearch,
  executeFacetSearch,
} from '../../../../features/facets/facet-search-set/generic/generic-facet-search-actions';
import {updateFacetSearch} from '../../../../features/facets/facet-search-set/specific/specific-facet-search-actions';
import {SpecificFacetSearchState} from '../../../../features/facets/facet-search-set/specific/specific-facet-search-set-state';
import {
  buildMockSearchAppEngine,
  MockSearchEngine,
} from '../../../../test/mock-engine';
import {buildMockFacetSearch} from '../../../../test/mock-facet-search';
import {buildMockFacetSearchRequestOptions} from '../../../../test/mock-facet-search-request-options';
import {buildMockFacetSearchResponse} from '../../../../test/mock-facet-search-response';
import {
  buildGenericFacetSearch,
  GenericFacetSearch,
  GenericFacetSearchProps,
} from './facet-search';

describe('FacetSearch', () => {
  const facetId = '1';
  const numberOfValues = 7;
  let props: GenericFacetSearchProps<SpecificFacetSearchState>;
  let engine: MockSearchEngine;
  let controller: GenericFacetSearch;

  function initFacetSearch() {
    controller = buildGenericFacetSearch(engine, props);
  }

  function getFacetSearch() {
    const options = buildMockFacetSearchRequestOptions({
      numberOfValues,
    });
    return buildMockFacetSearch({
      options,
      initialNumberOfValues: numberOfValues,
    });
  }

  beforeEach(() => {
    props = {
      options: {facetId},
      getFacetSearch,
      isForFieldSuggestions: false,
    };

    engine = buildMockSearchAppEngine();
    initFacetSearch();
  });

  it('#updateText dispatches #updateFacetSearch and resets number of results', () => {
    const text = 'apple';
    controller.updateText(text);

    const action = updateFacetSearch({
      facetId,
      query: text,
      numberOfValues,
    });

    expect(engine.actions).toContainEqual(action);
  });

  describe('#showMoreResults', () => {
    beforeEach(() => {
      const options = buildMockFacetSearchRequestOptions({
        numberOfValues,
      });
      engine.state.facetSearchSet[facetId] = buildMockFacetSearch({
        options,
      });
      controller.showMoreResults();
    });

    it('#showMoreResults dispatches #updateFacetSearch', () => {
      const incrementAction = updateFacetSearch({
        facetId,
        numberOfValues: numberOfValues * 2,
      });

      expect(engine.actions).toContainEqual(incrementAction);
    });

    it('#showMoreResults dispatches #executeFacetSearch', () => {
      const executeAction = engine.actions.find(
        (a) => a.type === executeFacetSearch.pending.type
      );

      expect(engine.actions).toContainEqual(executeAction);
    });
  });

  it('#search dispatches #executeFacetSearch action', () => {
    controller.search();
    const action = engine.actions.find(
      (a) => a.type === executeFacetSearch.pending.type
    );

    expect(action).toBeTruthy();
  });

  it('#clear dispatches #clearFacetSearch', () => {
    const options = buildMockFacetSearchRequestOptions();
    engine.state.facetSearchSet[facetId] = buildMockFacetSearch({
      options,
    });
    controller.clear();
    const clearFacetSearchAction = clearFacetSearch({
      facetId,
    });

    expect(engine.actions).toContainEqual(clearFacetSearchAction);
  });

  it('#updateCaptions dispatches #updateFacetSearch with the new captions', () => {
    const captions = {hello: 'world'};
    controller.updateCaptions({hello: 'world'});
    expect(engine.actions).toContainEqual(
      updateFacetSearch({facetId, captions})
    );
  });

  it('calling #state returns the response', () => {
    const facetSearchState = {
      ...buildMockFacetSearchResponse(),
      isLoading: false,
      query: '',
    };

    engine.state.facetSearchSet[facetId] =
      buildMockFacetSearch(facetSearchState);
    expect(controller.state).toEqual(facetSearchState);
  });
});
