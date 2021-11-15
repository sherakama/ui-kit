import {platformUrl} from '../../api/platform-client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {
  BasicConfigurationState,
  getBasicConfigurationInitialState,
} from '../basic-configuration/basic-configuration-state';
import {
  AnalyticsConfiguration,
  getAnalyticsConfigurationInitialState,
} from '../analytics-configuration/analytics-configuration-state';

dayjs.extend(utc);
dayjs.extend(timezone);

export interface SearchConfiguration {
  search: {
    /**
     * The Search API base URL to use.
     * By default, will append /rest/search/v2 to the platformUrl value.
     */
    apiBaseUrl: string;
    /**
     * The locale of the current user. Must comply with IETF’s BCP 47 definition: https://www.rfc-editor.org/rfc/bcp/bcp47.txt.
     */
    locale: string;
    /**
     * The [tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) identifier of the time zone to use to correctly interpret dates in the query expression, facets, and result items.
     * By default, the timezone will be [guessed](https://day.js.org/docs/en/timezone/guessing-user-timezone).
     */
    timezone: string;
  };
}

export type SearchConfigurationState = BasicConfigurationState &
  AnalyticsConfiguration &
  SearchConfiguration;

export const searchAPIEndpoint = '/rest/search/v2';

export const getSearchConfigurationInitialState: () => SearchConfigurationState =
  () => ({
    ...getBasicConfigurationInitialState(),
    ...getAnalyticsConfigurationInitialState(),
    search: {
      apiBaseUrl: `${platformUrl()}${searchAPIEndpoint}`,
      locale: 'en-US',
      timezone: dayjs.tz.guess(),
    },
  });
