// TODO: These types needs to be exported top level from headless
/*import {
  AsyncThunkSearchOptions,
  SearchAPIClient,
} from '@coveo/headless/dist/definitions/api/search/search-api-client';*/
import {createAsyncThunk} from '@reduxjs/toolkit';

/*export interface GetThesaurusPlanReturn {}
 */

export interface GetThesaurusPlanCreatorPayload {
  id: string;
}

export const getThesaurusPlan = createAsyncThunk(
  'thesaurusDebugger/plan',
  async (payload, {dispatch, getState, extra}) => {
    console.log(payload, dispatch, getState, extra);
  }
);
