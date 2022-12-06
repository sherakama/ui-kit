import {DateFacetRequest} from './interfaces/request';

export type DateFacetSlice = {
  request: DateFacetRequest;
};

export type DateFacetSetState = Record<string, DateFacetSlice>;

export function getDateFacetSetSliceInitialState(
  request: DateFacetRequest
): DateFacetSlice {
  return {request};
}

export function getDateFacetSetInitialState(): DateFacetSetState {
  return {};
}
