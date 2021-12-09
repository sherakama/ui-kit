// TODO: These types needs to be exported top level from headless
import {SearchAppState} from '@coveo/headless';
//import { PlanResponseSuccess } from '@coveo/headless/dist/definitions/api/search/plan/plan-response';
//import {getVisitorID} from '@coveo/headless/dist/definitions/api/analytics/analytics';
//import {isErrorResponse} from '@coveo/headless/dist/definitions/api/search/search-api-client';
import {createAsyncThunk} from '@reduxjs/toolkit';

// TODO missing type from API return
export interface GetThesaurusPlanReturn {
  parsedInput: {
    basicExpression: string;
  };
}

interface AsyncThunkGetThesaurusOptions {
  state: SearchAppState;
  extra: {apiClient: any}; // TODO missing type
}

export interface GetThesaurusPlanCreatorPayload {
  id: string;
}

export const getThesaurusPlan = createAsyncThunk<
  GetThesaurusPlanReturn,
  string,
  AsyncThunkGetThesaurusOptions
>(
  'thesaurusDebugger/plan',
  async (value: string, {getState, rejectWithValue, extra}) => {
    const {apiClient} = extra;
    const state = getState();
    const request = await buildPlanRequest(state, value);
    const response = await apiClient.plan(request);
    if (response.error) {
      // TODO missing auto error detection
      return rejectWithValue(response.error);
    }
    // TODO missing return type from API client
    return response.success as GetThesaurusPlanReturn;
  }
);

// TODO
const buildPlanRequest = async (state: SearchAppState, value: string) => {
  return {
    accessToken: state.configuration.accessToken,
    organizationId: state.configuration.organizationId,
    url: state.configuration.search.apiBaseUrl,
    locale: state.configuration.search.locale,
    timezone: state.configuration.search.timezone,
    q: value,
    ...(state.context && {context: state.context.contextValues}),
    ...(state.pipeline && {pipeline: state.pipeline}),
    ...(state.searchHub && {searchHub: state.searchHub}),
    ...(state.configuration.analytics.enabled && {
      visitorId: '', //await getVisitorID(), TODO not exported
    }),
  };
};
