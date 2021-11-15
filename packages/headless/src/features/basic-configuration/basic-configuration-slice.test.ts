import {basicConfigurationReducer} from './basic-configuration-slice';
import {updateBasicConfiguration} from './basic-configuration-actions';
import {
  BasicConfigurationState,
  getBasicConfigurationInitialState,
} from './basic-configuration-state';

describe('configuration slice', () => {
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
  });
});
