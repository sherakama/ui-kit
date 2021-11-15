import {createReducer} from '@reduxjs/toolkit';
import {updateBasicConfiguration} from './basic-configuration-actions';
import {getBasicConfigurationInitialState} from './basic-configuration-state';

export const basicConfigurationReducer = createReducer(
  getBasicConfigurationInitialState(),
  (builder) =>
    builder.addCase(updateBasicConfiguration, (state, action) => {
      if (action.payload.accessToken) {
        state.accessToken = action.payload.accessToken;
      }
      if (action.payload.organizationId) {
        state.organizationId = action.payload.organizationId;
      }
      if (action.payload.platformUrl) {
        state.platformUrl = action.payload.platformUrl;
      }
    })
);
