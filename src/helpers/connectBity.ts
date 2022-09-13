import {
  BityApiClient,
  BityApiClientConfig,
  BityApiClientInterface,
} from '@bity/api';

import { BITY_CLIENT_ID, REDIRECT_URL } from './constants';

const newBityApiClient = (
  config: BityApiClientConfig,
): Promise<BityApiClientInterface> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // can't convert the constructor function to a class.
  return new BityApiClient(config);
};

export const getBityApiClient = async (): Promise<BityApiClientInterface> => {
  const clientId = BITY_CLIENT_ID;

  return await newBityApiClient({
    exchangeApiUrl: 'https://exchange.api.bity.com',
    clientId,
    oauthConfig: {
      clientId,
      authorizationUrl: 'https://connect.bity.com/oauth2/auth',
      tokenUrl: 'https://connect.bity.com/oauth2/token',
      scopes: [
        'https://auth.bity.com/scopes/exchange.place',
        'https://auth.bity.com/scopes/exchange.history',
      ],
      redirectUrl: REDIRECT_URL,
      onAccessTokenExpiry: (refreshAccessToken) => refreshAccessToken(),
      onInvalidGrant: (refreshAuthCodeOrRefreshToken) =>
        refreshAuthCodeOrRefreshToken(),
    },
  });
};
