import {platformUrl} from '../../api/platform-client';

export interface BasicConfigurationState {
  /**
   * The unique identifier of the target Coveo Cloud organization (e.g., `mycoveocloudorganizationg8tp8wu3`)
   */
  organizationId: string;
  /**
   * The access token to use to authenticate requests against the Coveo Cloud endpoints. Typically, this will be an API key or search token that grants the privileges to execute queries and push usage analytics data in the target Coveo Cloud organization.
   */
  accessToken: string;
  /**
   * The Plaform URL to use.
   * By default, https://platform.cloud.coveo.com
   */
  platformUrl: string;
}

export const getBasicConfigurationInitialState: () => BasicConfigurationState =
  () => ({
    organizationId: '',
    accessToken: '',
    platformUrl: platformUrl(),
  });
