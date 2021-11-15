import {analyticsConfigurationReducer} from './analytics-configuration-slice';
import {
  disableAnalytics,
  enableAnalytics,
  updateAnalyticsConfiguration,
  setOriginLevel3,
  setOriginLevel2,
} from './analytics-configuration-actions';
import {platformUrl} from '../../api/platform-client';
import {
  AnalyticsConfiguration,
  getAnalyticsConfigurationInitialState,
} from './analytics-configuration-state';
import {updateActiveTab} from '../tab-set/tab-set-actions';
import {restoreSearchParameters} from '../search-parameters/search-parameter-actions';

describe('analytics configuration slice', () => {
  const url = platformUrl({environment: 'dev', region: 'eu'});
  const existingState: AnalyticsConfiguration = {
    ...getAnalyticsConfigurationInitialState(),
    analytics: {
      enabled: true,
      originLevel2: '2',
      originLevel3: '3',
      apiBaseUrl: `${url}/rest/ua`,
      anonymous: false,
    },
  };

  it('should have initial state', () => {
    expect(
      analyticsConfigurationReducer(undefined, {type: 'randomAction'})
    ).toEqual(getAnalyticsConfigurationInitialState());
  });

  describe('updateAnalyticsConfiguration', () => {
    it('works on initial state', () => {
      const expectedState: AnalyticsConfiguration = {
        ...getAnalyticsConfigurationInitialState(),
        analytics: {
          enabled: false,
          originLevel2: 'bar',
          originLevel3: 'buzz',
          apiBaseUrl: 'http://test.com/analytics',
          anonymous: true,
        },
      };
      expect(
        analyticsConfigurationReducer(
          undefined,
          updateAnalyticsConfiguration({
            enabled: false,
            originLevel2: 'bar',
            originLevel3: 'buzz',
            apiBaseUrl: 'http://test.com/analytics',
            anonymous: true,
          })
        )
      ).toEqual(expectedState);
    });

    it('works on an existing state', () => {
      const expectedState: AnalyticsConfiguration = {
        ...existingState,
        analytics: {
          enabled: true,
          originLevel2: 'bar',
          originLevel3: 'buzz',
          apiBaseUrl: 'http://test.com/analytics',
          anonymous: true,
        },
      };

      expect(
        analyticsConfigurationReducer(
          existingState,
          updateAnalyticsConfiguration({
            enabled: true,
            originLevel2: 'bar',
            originLevel3: 'buzz',
            apiBaseUrl: 'http://test.com/analytics',
            anonymous: true,
          })
        )
      ).toEqual(expectedState);
    });

    it('setting apiBaseUrl to a relative url does not return an error', () => {
      const apiBaseUrl = '/rest/ua';
      const action = updateAnalyticsConfiguration({apiBaseUrl});
      expect('error' in action).toBe(false);
    });
  });

  it('should handle disable analytics', () => {
    const state = getAnalyticsConfigurationInitialState();
    state.analytics.enabled = true;

    expect(
      analyticsConfigurationReducer(state, disableAnalytics()).analytics.enabled
    ).toBe(false);
  });

  it('should handle enable analytics', () => {
    const state = getAnalyticsConfigurationInitialState();
    state.analytics.enabled = false;
    expect(
      analyticsConfigurationReducer(state, enableAnalytics()).analytics.enabled
    ).toBe(true);
  });

  it('should handle #setOriginLevel2', () => {
    const originLevel2 = 'bar';
    const state = getAnalyticsConfigurationInitialState();
    state.analytics.originLevel2 = 'foo';
    expect(
      analyticsConfigurationReducer(state, setOriginLevel2({originLevel2}))
        .analytics.originLevel2
    ).toBe(originLevel2);
  });

  it('should handle #setOriginLevel3', () => {
    const originLevel3 = 'bar';
    const state = getAnalyticsConfigurationInitialState();
    state.analytics.originLevel3 = 'foo';
    expect(
      analyticsConfigurationReducer(state, setOriginLevel3({originLevel3}))
        .analytics.originLevel3
    ).toBe(originLevel3);
  });

  it('#updateActiveTab updates the originLevel2 to the tab id', () => {
    const state = getAnalyticsConfigurationInitialState();
    state.analytics.originLevel2 = 'default';

    const finalState = analyticsConfigurationReducer(
      state,
      updateActiveTab('tab')
    );
    expect(finalState.analytics.originLevel2).toBe('tab');
  });

  describe('#restoreSearchParameters', () => {
    it('when the #tab property is a non-empty string, it updates the originLevel2', () => {
      const state = getAnalyticsConfigurationInitialState();
      const finalState = analyticsConfigurationReducer(
        state,
        restoreSearchParameters({tab: 'All'})
      );
      expect(finalState.analytics.originLevel2).toBe('All');
    });

    it('when the #tab property is an empty string, it does nothing', () => {
      const state = getAnalyticsConfigurationInitialState();
      state.analytics.originLevel2 = 'default';

      const finalState = analyticsConfigurationReducer(
        state,
        restoreSearchParameters({tab: ''})
      );
      expect(finalState.analytics.originLevel2).toBe('default');
    });
  });
});
