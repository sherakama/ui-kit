import {CoveoInsightClient} from 'coveo.analytics';
import {AnalyticsClientFactory} from '../api/analytics/search-analytics';
import {InsightAPIClient} from '../api/service/insight/insight-api-client';
import {ClientThunkExtraArguments} from './thunk-extra-arguments';

export type InsightClientThunkExtraArguments = ClientThunkExtraArguments<
  InsightAPIClient,
  AnalyticsClientFactory<CoveoInsightClient>
>;

export interface InsightThunkExtraArguments
  extends InsightClientThunkExtraArguments {}
