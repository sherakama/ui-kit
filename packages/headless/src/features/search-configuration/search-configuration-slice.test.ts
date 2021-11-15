import {configurationReducer} from './search-configuration-slice';
import {updateSearchConfiguration} from './search-configuration-actions';
import {platformUrl} from '../../api/platform-client';
import {
  getSearchConfigurationInitialState,
  SearchConfigurationState,
} from './search-configuration-state';

describe('search configuration slice', () => {
  const url = platformUrl({environment: 'dev', region: 'eu'});
  const existingState: SearchConfigurationState = {
    ...getSearchConfigurationInitialState(),
    accessToken: 'mytoken123',
    organizationId: 'myorg',
    search: {
      apiBaseUrl: `${url}/rest/search/v2`,
      locale: 'en-US',
      timezone: 'Africa/Johannesburg',
    },
    analytics: {
      enabled: true,
      originLevel2: '2',
      originLevel3: '3',
      apiBaseUrl: `${url}/rest/ua`,
      anonymous: false,
    },
  };

  it('should have initial state', () => {
    expect(configurationReducer(undefined, {type: 'randomAction'})).toEqual(
      getSearchConfigurationInitialState()
    );
  });

  describe('updateSearchConfiguration', () => {
    it('works on initial state', () => {
      const expectedState: SearchConfigurationState = {
        ...getSearchConfigurationInitialState(),
        search: {
          apiBaseUrl: 'http://test.com/search',
          locale: 'fr-CA',
          timezone: 'Africa/Johannesburg',
        },
      };

      expect(
        configurationReducer(
          undefined,
          updateSearchConfiguration({
            apiBaseUrl: 'http://test.com/search',
            locale: 'fr-CA',
            timezone: 'Africa/Johannesburg',
          })
        )
      ).toEqual(expectedState);
    });

    it('works on existing state', () => {
      const expectedState: SearchConfigurationState = {
        ...existingState,
        search: {
          apiBaseUrl: 'http://test.com/search',
          locale: 'fr-CA',
          timezone: 'Africa/Johannesburg',
        },
      };

      expect(
        configurationReducer(
          existingState,
          updateSearchConfiguration({
            apiBaseUrl: 'http://test.com/search',
            locale: 'fr-CA',
            timezone: 'Africa/Johannesburg',
          })
        )
      ).toEqual(expectedState);
    });

    it('setting apiBaseUrl to a relative url does not return an error', () => {
      const apiBaseUrl = '/rest/search/v2';
      const action = updateSearchConfiguration({apiBaseUrl});
      expect('error' in action).toBe(false);
    });
  });
});
