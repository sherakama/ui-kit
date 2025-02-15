import {ProductRecommendation} from '../../api/search/search/product-recommendation';
import {ProductRecommendationEngine} from '../../app/product-recommendation-engine/product-recommendation-engine';
import {
  AnalyticsType,
  ProductRecommendationAction,
} from '../analytics/analytics-utils';
import {logProductRecommendationOpen} from './product-recommendations-analytics.actions';

/**
 * The click analytics action creators.
 */
export interface ClickAnalyticsActionCreators {
  /**
   * The event to log when a recommendation is selected.
   *
   * @param recommendation - The selected recommendation.
   * @returns A dispatchable action.
   */
  logProductRecommendationOpen(
    productRecommendation: ProductRecommendation
  ): ProductRecommendationAction<AnalyticsType.Click>;
}

/**
 * Returns possible click analytics action creators.
 *
 * @param engine - The headless engine.
 * @returns An object holding the action creators.
 */
export function loadClickAnalyticsActions(
  engine: ProductRecommendationEngine
): ClickAnalyticsActionCreators {
  engine.addReducers({});

  return {
    logProductRecommendationOpen,
  };
}
