import { BityApiClient, BityApiClientInterface } from "@bity/api";

export async function connectBity (bityApiKey: string): Promise<BityApiClientInterface> {
  // @ts-ignore // can't convert the constructor function to a class.
  const bity = await new BityApiClient({
    exchangeApiUrl: 'https://exchange.api.bity.com',
    clientId: bityApiKey,
    oauthConfig: {
      authorizationUrl: 'https://connect.bity.com/oauth2/auth',
      tokenUrl: 'https://connect.bity.com/oauth2/token',
      clientId: bityApiKey,
      scopes: ['https://auth.bity.com/scopes/exchange.place', 'https://auth.bity.com/scopes/exchange.history'],
      redirectUrl: 'https://localhost:8080/',
      onAccessTokenExpiry: (refreshAccessToken) => {
        return refreshAccessToken()
      },
      onInvalidGrant: (refreshAuthCodeOrRefreshToken) => {
        console.log(refreshAuthCodeOrRefreshToken)
      },
    }
  });

  bity.fetchAuthorizationCode();

  bity.isReturningFromAuthServer().then((hasReturned:boolean) => {
    if (!hasReturned) {
    }

    bity.getAccessToken().then((res: any) => {
      // location.replace('https://localhost:8080');
      console.log(res.token)
    })
  })

  localStorage.setItem('bity-key', JSON.stringify(bityApiKey));
  return bity;
}
