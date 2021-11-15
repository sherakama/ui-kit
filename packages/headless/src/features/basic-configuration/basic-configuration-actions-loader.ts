import {PayloadAction} from '@reduxjs/toolkit';
import {CoreEngine} from '../../app/engine';
import {basicConfiguration} from '../../app/reducers';
import {
  updateBasicConfiguration,
  UpdateBasicConfigurationActionCreatorPayload,
} from './basic-configuration-actions';

export {UpdateBasicConfigurationActionCreatorPayload};

/**
 * The configuration action creators.
 */
export interface BasicConfigurationActionCreators {
  /**
   * Updates the global headless engine configuration.
   *
   * @param payload - The action creator payload.
   * @returns A dispatchable action.
   * */
  updateBasicConfiguration(
    payload: UpdateBasicConfigurationActionCreatorPayload
  ): PayloadAction<UpdateBasicConfigurationActionCreatorPayload>;
}

/**
 * Loads the `basicConfiguration` reducer and returns possible action creators.
 *
 * @param engine - The headless engine.
 * @returns An object holding the action creators.
 */
export function loadConfigurationActions(
  engine: CoreEngine
): BasicConfigurationActionCreators {
  engine.addReducers({basicConfiguration});

  return {
    updateBasicConfiguration,
  };
}
