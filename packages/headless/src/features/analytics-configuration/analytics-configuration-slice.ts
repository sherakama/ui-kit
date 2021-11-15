import {isNullOrUndefined} from '@coveo/bueno';
import {createReducer} from '@reduxjs/toolkit';
import {updateBasicConfiguration} from '../basic-configuration/basic-configuration-actions';
import {restoreSearchParameters} from '../search-parameters/search-parameter-actions';
import {updateActiveTab} from '../tab-set/tab-set-actions';
import {
  disableAnalytics,
  enableAnalytics,
  updateAnalyticsConfiguration,
  setOriginLevel2,
  setOriginLevel3,
} from './analytics-configuration-actions';
import {
  analyticsAPIEndpoint,
  getAnalyticsConfigurationInitialState,
} from './analytics-configuration-state';

function analyticsUrlFromPlatformUrl(
  platformUrl: string,
  organizationId: string
) {
  const isCoveoPlatformURL =
    /^https:\/\/platform(dev|qa|hipaa)?(-)?(eu|au)?\.cloud\.coveo\.com/.test(
      platformUrl
    );
  if (isCoveoPlatformURL) {
    return (
      platformUrl.replace(/^(https:\/\/)platform/, '$1analytics') +
      analyticsAPIEndpoint
    );
  }

  const isCoveoOrgDomainUrlMatch = platformUrl.match(
    new RegExp(`^https://(${organizationId}\\.org)\\.coveo.com`)
  );
  if (isCoveoOrgDomainUrlMatch) {
    return (
      platformUrl.replace(isCoveoOrgDomainUrlMatch[1], 'analytics.cloud') +
      analyticsAPIEndpoint
    );
  }

  return platformUrl;
}

export const analyticsConfigurationReducer = createReducer(
  getAnalyticsConfigurationInitialState(),
  (builder) =>
    builder
      .addCase(updateBasicConfiguration, (state, action) => {
        if (action.payload.platformUrl) {
          state.analytics.apiBaseUrl = analyticsUrlFromPlatformUrl(
            action.payload.platformUrl,
            state.organizationId //TODO fix this somehow.
          );
        }
      })
      .addCase(updateAnalyticsConfiguration, (state, action) => {
        if (!isNullOrUndefined(action.payload.enabled)) {
          state.analytics.enabled = action.payload.enabled;
        }
        if (!isNullOrUndefined(action.payload.originLevel2)) {
          state.analytics.originLevel2 = action.payload.originLevel2;
        }
        if (!isNullOrUndefined(action.payload.originLevel3)) {
          state.analytics.originLevel3 = action.payload.originLevel3;
        }
        if (!isNullOrUndefined(action.payload.apiBaseUrl)) {
          state.analytics.apiBaseUrl = action.payload.apiBaseUrl;
        }
        if (!isNullOrUndefined(action.payload.runtimeEnvironment)) {
          state.analytics.runtimeEnvironment =
            action.payload.runtimeEnvironment;
        }
        if (!isNullOrUndefined(action.payload.anonymous)) {
          state.analytics.anonymous = action.payload.anonymous;
        }
      })
      .addCase(disableAnalytics, (state) => {
        state.analytics.enabled = false;
      })
      .addCase(enableAnalytics, (state) => {
        state.analytics.enabled = true;
      })
      .addCase(setOriginLevel2, (state, action) => {
        state.analytics.originLevel2 = action.payload.originLevel2;
      })
      .addCase(setOriginLevel3, (state, action) => {
        state.analytics.originLevel3 = action.payload.originLevel3;
      })
      .addCase(updateActiveTab, (state, action) => {
        state.analytics.originLevel2 = action.payload;
      })
      .addCase(restoreSearchParameters, (state, action) => {
        state.analytics.originLevel2 =
          action.payload.tab || state.analytics.originLevel2;
      })
);
