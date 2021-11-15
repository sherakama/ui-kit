import {IRuntimeEnvironment} from 'coveo.analytics';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {analyticsUrl} from '../../api/platform-client';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * The global headless engine Usage Analytics API configuration.
 */
export interface AnalyticsConfiguration {
  analytics: {
    /**
     * Specifies if analytics tracking should be enabled. By default analytics events are tracked.
     */
    enabled: boolean;
    /**
     * The Analytics API base URL to use.
     * By default, will append /rest/ua to the platformUrl value.
     */
    apiBaseUrl: string;
    /**
     * Origin level 2 is a usage analytics event metadata whose value should typically be the name/identifier of the tab from which the usage analytics event originates.
     *
     * When logging a Search usage analytics event, originLevel2 should always be set to the same value as the corresponding tab (parameter) Search API query parameter so Coveo Machine Learning models function properly, and usage analytics reports and dashboards are coherent.
     *
     * This value is optional, and will automatically try to resolve itself from the tab search parameter.
     */
    originLevel2: string;

    /**
     * Origin level 3 is a usage analytics event metadata whose value should typically be the URL of the page that linked to the search interface that’s making the request.
     *
     * When logging a Search usage analytics event, originLevel3 should always be set to the same value as the corresponding referrer Search API query parameter so usage analytics reports and dashboards are coherent.
     *
     * This value is optional, and will automatically try to resolve itself from the referrer search parameter.
     */
    originLevel3: string;
    /**
     * Optional analytics runtime environment, this is needed for analytics to work correctly if you're running outside of a browser.
     * See https://github.com/coveo/coveo.analytics.js for more info
     */
    runtimeEnvironment?: IRuntimeEnvironment;
    /**
     * Whether analytics events should be logged anonymously.
     * If set to true, the Usage Analytics Write API will not extract the name and userDisplayName, if present, from the search token
     */
    anonymous: boolean;
  };
}

export const analyticsAPIEndpoint = '/rest/ua';

export const getAnalyticsConfigurationInitialState: () => AnalyticsConfiguration =
  () => ({
    analytics: {
      enabled: true,
      apiBaseUrl: `${analyticsUrl()}${analyticsAPIEndpoint}`,
      originLevel2: 'default',
      originLevel3: 'default',
      anonymous: false,
    },
  });
