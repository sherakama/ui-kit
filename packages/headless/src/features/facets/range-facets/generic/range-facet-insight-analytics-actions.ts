import type {FacetRangeMetadata} from 'coveo.analytics/dist/definitions/searchPage/searchPageEvents';
import {InsightAppState} from '../../../../state/insight-app-state';
import {RangeFacetSelectionPayload} from './range-facet-validate-payload';

export const getRangeFacetMetadata = (
  state: Partial<InsightAppState>,
  {facetId, selection}: RangeFacetSelectionPayload
): FacetRangeMetadata => {
  const facet = state.dateFacetSet![facetId] || state.numericFacetSet![facetId];
  const facetField = facet.request.field;
  const facetTitle = `${facetField}_${facetId}`;
  return {
    facetId,
    facetField,
    facetTitle,
    facetRangeEndInclusive: selection.endInclusive,
    facetRangeEnd: `${selection.end}`,
    facetRangeStart: `${selection.start}`,
  };
};
