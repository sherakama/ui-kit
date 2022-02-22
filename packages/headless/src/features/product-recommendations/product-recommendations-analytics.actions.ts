import {
  ProductRecommendationAnalyticsProvider,
  StateNeededByProductRecommendationsAnalyticsProvider,
} from '../../api/analytics/product-recommendations-analytics';
import {
  AnalyticsType,
  makeAnalyticsActionWithDescription,
} from '../analytics/analytics-utils';

export const logProductRecommendations = () =>
  makeAnalyticsActionWithDescription(
    'analytics/productrecommendations/load',
    AnalyticsType.Search,
    (client) => client.buildRecommendationInterfaceLoad(),
    (state) =>
      new ProductRecommendationAnalyticsProvider(
        state as StateNeededByProductRecommendationsAnalyticsProvider
      )
  );
