import {basicConfigurationReducer} from './basic-configuration-slice';
import {updateBasicConfiguration} from './basic-configuration-actions';
import {platformUrl} from '../../api/platform-client';
import {
  BasicConfigurationState,
  getBasicConfigurationInitialState,
} from './basic-configuration-state';
import {allValidPlatformCombination} from '../../test/platform-url';

describe('configuration slice', () => {
  const url = platformUrl({environment: 'dev', region: 'eu'});
  const existingState: BasicConfigurationState = {
    ...getBasicConfigurationInitialState(),
    accessToken: 'mytoken123',
    organizationId: 'myorg',
  };

  it('should have initial state', () => {
    expect(
      basicConfigurationReducer(undefined, {type: 'randomAction'})
    ).toEqual(getBasicConfigurationInitialState());
  });

  describe('updateBasicConfiguration', () => {
    it('works on initial state', () => {
      const expectedState: BasicConfigurationState = {
        ...getBasicConfigurationInitialState(),
        accessToken: 'mytoken123',
        organizationId: 'myorg',
      };
      expect(
        basicConfigurationReducer(
          undefined,
          updateBasicConfiguration({
            organizationId: 'myorg',
            accessToken: 'mytoken123',
          })
        )
      ).toEqual(expectedState);
    });

    it('works on an existing state', () => {
      const expectedState: BasicConfigurationState = {
        ...existingState,
        accessToken: 'mynewtoken',
        organizationId: 'myotherorg',
      };

      expect(
        basicConfigurationReducer(
          existingState,
          updateBasicConfiguration({
            accessToken: 'mynewtoken',
            organizationId: 'myotherorg',
          })
        )
      ).toEqual(expectedState);
    });

    it('setting platformUrl to a relative url does not return an error', () => {
      const platformUrl = '/rest/search/v2';
      const action = updateBasicConfiguration({platformUrl});
      expect('error' in action).toBe(false);
    });

    it('setting platformUrl keep search and analytics url in sync', () => {
      allValidPlatformCombination().forEach((expectation) => {
        const newState = basicConfigurationReducer(
          existingState,
          updateBasicConfiguration({
            platformUrl: expectation.platform,
          })
        );

        expect(newState.search.apiBaseUrl).toBe(expectation.search);
        expect(newState.analytics.apiBaseUrl).toBe(expectation.analytics);
      });
    });

    it('setting platformUrl to a relative URL keep search and analytics url in sync', () => {
      const newState = basicConfigurationReducer(
        existingState,
        updateBasicConfiguration({
          platformUrl: '/foo',
        })
      );

      expect(newState.search.apiBaseUrl).toBe('/foo/rest/search/v2');
      expect(newState.analytics.apiBaseUrl).toBe('/foo');
    });

    it('setting platformUrl to a non relative URL pointing to a non Coveo platform keep search and analytics url in sync', () => {
      const newState = basicConfigurationReducer(
        existingState,
        updateBasicConfiguration({
          platformUrl: 'https://my.domain.com',
        })
      );

      expect(newState.search.apiBaseUrl).toBe(
        'https://my.domain.com/rest/search/v2'
      );
      expect(newState.analytics.apiBaseUrl).toBe('https://my.domain.com');
    });
  });
});
