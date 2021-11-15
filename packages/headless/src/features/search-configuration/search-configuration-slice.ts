import {createReducer} from '@reduxjs/toolkit';
import {updateBasicConfiguration} from '../basic-configuration/basic-configuration-actions';
import {updateSearchConfiguration} from './search-configuration-actions';
import {
  getSearchConfigurationInitialState,
  searchAPIEndpoint,
} from './search-configuration-state';

export const configurationReducer = createReducer(
  getSearchConfigurationInitialState(),
  (builder) =>
    builder
      .addCase(updateBasicConfiguration, (state, action) => {
        if (action.payload.platformUrl) {
          state.search.apiBaseUrl = `${action.payload.platformUrl}${searchAPIEndpoint}`;
        }
      })
      .addCase(updateSearchConfiguration, (state, action) => {
        if (action.payload.apiBaseUrl) {
          state.search.apiBaseUrl = action.payload.apiBaseUrl;
        }
        if (action.payload.locale) {
          state.search.locale = action.payload.locale;
        }
        if (action.payload.timezone) {
          state.search.timezone = action.payload.timezone;
        }
      })
);
