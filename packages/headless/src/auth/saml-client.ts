import {buildSamlFlow} from './saml-flow';

export interface SamlClientOptions {
  /**
   * The unique identifier of the target Coveo Cloud organization (e.g., mycoveoorganizationg8tp8wu3).
   */
  organizationId: string;

  /**
   * The SAML authentication provider name (e.g., `oktaA323aab78b9f1-45b5-a095-a1f0fa09ddd5`). See [Creating a Search API SAML Authentication Provider](https://docs.coveo.com/en/91/build-a-search-ui/saml-authentication#creating-a-search-api-saml-authentication-provider).

]
   */
  provider: string;

  /**
   * The Coveo origin to authenticate through.
   *
   * @defaultValue `https://platform.cloud.coveo.com`
   */
  platformOrigin?: string;
}

export interface SamlClient {
  /**
   * Initiates a SAML flow resolving with a Coveo access token.
   *
   * @returns A promise resolving with a Coveo access token.
   */
  authenticate(): Promise<string>;
}

/**
 * Instantiates a SAML client.
 *
 * @param config - The SAML client options.
 * @returns A SAML client instance.
 */
export function buildSamlClient(config: SamlClientOptions): SamlClient {
  const provider = buildSamlFlow(config);

  return {
    async authenticate() {
      if (provider.handshakeTokenAvailable) {
        return await provider.exchangeHandshakeToken();
      }

      provider.login();
      return '';
    },
  };
}
