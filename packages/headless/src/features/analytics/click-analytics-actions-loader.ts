import {Result} from '../../api/search/search/result';
import {SearchEngine} from '../../app/search-engine/search-engine';
import {logDocumentOpen} from '../result/result-analytics-actions';
import {ClickAnalyticsPayload} from './analytics-utils';

/**
 * The click analytics action creators.
 */
export interface ClickAnalyticsActionCreators {
  /**
   * The event to log when a result is selected.
   *
   * @param result - The selected result.
   * @returns A dispatchable action.
   */
  logDocumentOpen(result: Result): ClickAnalyticsPayload;
}

/**
 * Returns possible click analytics action creators.
 *
 * @param engine - The headless engine.
 * @returns An object holding the action creators.
 */
export function loadClickAnalyticsActions(
  engine: SearchEngine
): ClickAnalyticsActionCreators {
  engine.addReducers({});

  return {
    logDocumentOpen,
  };
}
