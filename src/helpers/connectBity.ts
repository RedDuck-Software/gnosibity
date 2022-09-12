import {
  BityApiClient,
  BityApiClientInterface,
  BityApiClientConfig,
} from '@bity/api';

import { BITY_CLIENT_ID, OAUTH_KEY_NAME } from './constants';
import { getFromLocalStorage } from './localStorage';

const newBityApiClient = (
  config: BityApiClientConfig,
): Promise<BityApiClientInterface> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore // can't convert the constructor function to a class.
  return new BityApiClient(config);
};

export const getBityApiClient = async (): Promise<BityApiClientInterface> => {
  const clientId = BITY_CLIENT_ID;
  const oauthToken = getFromLocalStorage(OAUTH_KEY_NAME);

  const partialConfig = {
    exchangeApiUrl: 'https://exchange.api.bity.com',
    clientId,
  };

  if (oauthToken) {
    return await newBityApiClient(partialConfig);
  }

  const bity = await newBityApiClient({
    ...partialConfig,
    oauthConfig: {
      clientId,
      authorizationUrl: 'https://connect.bity.com/oauth2/auth',
      tokenUrl: 'https://connect.bity.com/oauth2/token',
      scopes: [
        'https://auth.bity.com/scopes/exchange.place',
        'https://auth.bity.com/scopes/exchange.history',
      ],
      redirectUrl: 'https://localhost:8080/',
      onAccessTokenExpiry: (refreshAccessToken) => refreshAccessToken(),
      onInvalidGrant: (refreshAuthCodeOrRefreshToken) =>
        console.log(refreshAuthCodeOrRefreshToken),
    },
  });
  bity.fetchAuthorizationCode();
  bity
    .isReturningFromAuthServer()
    .then(() => bity.getAccessToken().then((res) => console.log(res.token)));

  return bity;
};
