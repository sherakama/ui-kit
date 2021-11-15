import {createAction} from '@reduxjs/toolkit';
import {nonEmptyString, validatePayload} from '../../utils/validate-payload';

export interface UpdateSearchConfigurationActionCreatorPayload {
  /**
   * The Search API base URL to use (e.g., `https://platform.cloud.coveo.com/rest/search/v2`).
   */
  apiBaseUrl?: string;

  /**
   * The name of the query pipeline to use for the query (e.g., `External Search`).
   */
  pipeline?: string;

  /**
   * The first level of origin of the request, typically the identifier of the graphical search interface from which the request originates (e.g., `ExternalSearch`).
   */
  searchHub?: string;

  /**
   * The locale of the current user. Must comply with IETF’s BCP 47 definition: https://www.rfc-editor.org/rfc/bcp/bcp47.txt.
   */
  locale?: string;

  /**
   * The [tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) identifier of the time zone of the user.
   */
  timezone?: string;
}

/**
 * Updates the search configuration.
 * @param apiBaseUrl (string) The Search API base URL to use (e.g., `https://platform.cloud.coveo.com/rest/search/v2`).
 * @param pipeline (string) The name of the query pipeline to use for the query (e.g., `External Search`).
 * @param searchHub (string) The first level of origin of the request, typically the identifier of the graphical search interface from which the request originates (e.g., `ExternalSearch`).
 * @param locale (string) The locale of the current user. Must comply with IETF’s BCP 47 definition: https://www.rfc-editor.org/rfc/bcp/bcp47.txt.
 * @param timezone (string) The [tz database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) identifier of the time zone of the user.
 */
export const updateSearchConfiguration = createAction(
  'configuration/updateSearchConfiguration',
  (payload: UpdateSearchConfigurationActionCreatorPayload) =>
    validatePayload(payload, {
      apiBaseUrl: nonEmptyString,
      pipeline: nonEmptyString,
      searchHub: nonEmptyString,
      timezone: nonEmptyString,
      locale: nonEmptyString,
    })
);
