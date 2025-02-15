import {
  configuration,
  dateFacetSet,
  facetOptions,
  search,
} from '../../../../../app/reducers';
import {updateFacetOptions} from '../../../../../features/facet-options/facet-options-actions';
import {
  registerDateFacet,
  updateDateFacetValues,
} from '../../../../../features/facets/range-facets/date-facet-set/date-facet-actions';
import {SearchAppState} from '../../../../../state/search-app-state';
import {
  buildMockSearchAppEngine,
  createMockState,
  MockSearchEngine,
} from '../../../../../test';
import {buildMockDateFacetResponse} from '../../../../../test/mock-date-facet-response';
import {buildMockDateFacetSlice} from '../../../../../test/mock-date-facet-slice';
import {buildMockDateFacetValue} from '../../../../../test/mock-date-facet-value';
import * as FacetIdDeterminor from '../../_common/facet-id-determinor';
import {buildDateRange} from './date-range';
import {
  buildCoreDateFilter,
  DateFilter,
  DateFilterInitialState,
  DateFilterOptions,
} from './headless-core-date-filter';

describe('date filter', () => {
  const facetId = '1';
  let options: DateFilterOptions;
  let initialState: DateFilterInitialState | undefined;
  let state: SearchAppState;
  let engine: MockSearchEngine;
  let dateFacet: DateFilter;

  function initDateFilter() {
    engine = buildMockSearchAppEngine({state});
    dateFacet = buildCoreDateFilter(engine, {options, initialState});
  }

  beforeEach(() => {
    initialState = undefined;

    options = {
      facetId,
      field: 'created',
    };

    state = createMockState();
    state.dateFacetSet[facetId] = buildMockDateFacetSlice();

    initDateFilter();
  });

  it('#initDateFacet throws an error when an manual range is invalid', () => {
    initialState = {
      range: buildDateRange({start: 1616679091000, end: 1616592691000}),
    };
    expect(() => initDateFilter()).toThrow(
      'The start value is greater than the end value for the date range'
    );
  });

  it('it adds the correct reducers to engine', () => {
    expect(engine.addReducers).toHaveBeenCalledWith({
      dateFacetSet,
      facetOptions,
      configuration,
      search,
    });
  });

  it('calls #determineFacetId with the correct params', () => {
    jest.spyOn(FacetIdDeterminor, 'determineFacetId');

    initDateFilter();

    expect(FacetIdDeterminor.determineFacetId).toHaveBeenCalledWith(
      engine,
      options
    );
  });

  it('registers a date facet with the passed options', () => {
    const action = registerDateFacet({
      facetId,
      generateAutomaticRanges: false,
      currentValues: initialState?.range
        ? [{...initialState.range, endInclusive: true, state: 'selected'}]
        : [],
      ...options,
    });
    expect(engine.actions).toContainEqual(action);
  });

  it('when an option is invalid, it throws an error', () => {
    options.field = 0 as unknown as string;
    expect(() => initDateFilter()).toThrow(
      'Check the options of buildDateFacet'
    );
  });

  describe('#setRange', () => {
    it('dispatches a updateDateFacetValues with the passed value', () => {
      const value = buildMockDateFacetValue({});
      dateFacet.setRange(value);

      const action = updateDateFacetValues({
        facetId,
        values: [
          {
            ...value,
            state: 'selected',
            numberOfResults: 0,
            endInclusive: true,
          },
        ],
      });
      expect(engine.actions).toContainEqual(action);
    });

    it('should return true when range is valid', () => {
      const value = buildMockDateFacetValue(
        buildDateRange({start: 1616592691000, end: 1616592691000})
      );
      expect(dateFacet.setRange(value)).toBe(true);
    });

    it('should return false when range start value is greater than range end value', () => {
      const value = buildMockDateFacetValue(
        buildDateRange({start: 1616679091000, end: 1616592691000})
      );
      expect(dateFacet.setRange(value)).toBe(false);
    });
  });

  describe('#clear', () => {
    beforeEach(() => dateFacet.clear());

    it('dispatches #updateDateFacetValues with the facet id and an empty array', () => {
      expect(engine.actions).toContainEqual(
        updateDateFacetValues({facetId, values: []})
      );
    });

    it('dispatches a #updateFacetOptions action with #freezeFacetOrder true', () => {
      expect(engine.actions).toContainEqual(
        updateFacetOptions({freezeFacetOrder: true})
      );
    });
  });

  it('the state #range property should return the range if it is selected', () => {
    const value = buildMockDateFacetValue({state: 'selected'});
    state.search.response.facets = [
      buildMockDateFacetResponse({facetId, values: [value]}),
    ];

    expect(dateFacet.state.range).toEqual(value);
  });

  it('the state #range property should not return the range if it is not selected', () => {
    const value = buildMockDateFacetValue({state: 'idle'});
    state.search.response.facets = [
      buildMockDateFacetResponse({facetId, values: [value]}),
    ];

    expect(dateFacet.state.range).toBeUndefined();
  });

  it('#state.facetId exposes the facet id', () => {
    expect(dateFacet.state.facetId).toBe(facetId);
  });
});
