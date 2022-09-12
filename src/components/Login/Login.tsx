import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { SafeInfo } from "@gnosis.pm/safe-apps-sdk";
import {BityApiClient, BityApiClientInterface} from "@bity/api";
import { loadSdk } from "../../helpers/loadSdk";
import { connectBity } from "../../helpers/connectBity";
import { createOrder } from "../../helpers/createOrder";

import './styles.css';


export const Login: FC = () => {

  const storedKey = localStorage.getItem('bity-key')
    ? JSON.parse(localStorage.getItem('bity-key') ?? '')
    : '';

  const [safeInfo, setSafeInfo] = useState<SafeInfo>();
  const [bityApiKey, setBityApiKey] = useState<string>(storedKey);
  const [isOrderSectionHidden, setIsOrderSectionHidden] = useState<boolean>(true);
  const [bity, setBity] = useState<BityApiClientInterface | null>(null);

  useEffect(() => {
    loadSdk().then(info => {
      setSafeInfo(info);
    });
  }, []);

  const handleChangeKey = (event: ChangeEvent<HTMLInputElement>) => {
    setBityApiKey(event.target.value);
  }

  const getAccessToken = () => {
    let accessToken = ''
    const oauthState = localStorage.getItem("oauth2authcodepkce-state");
    if(typeof oauthState === 'string') {
      accessToken = JSON.parse(oauthState)?.accessToken?.value
    }
    console.log(accessToken)
    return accessToken
  }

  const handleConnectBity = async () => {
    //const connectedBity = await connectBity(bityApiKey);
    // @ts-ignore // can't convert the constructor function to a class.
    const bityInstance: any = new BityApiClient({
      exchangeApiUrl: 'https://exchange.api.bity.com',
      clientId: '7ZAlmqwgOtGQq_jA7jKGzw',
    });
    setBity(bityInstance);
    setIsOrderSectionHidden(false);
  }

  async function handleCreateOrder() {
    const code = localStorage.getItem('oauth2authcodepkce-state')
    if (code) {
      console.log(JSON.parse(code))
    }
    if(safeInfo?.safeAddress) {
      const result = createOrder(safeInfo?.safeAddress);
      const preparedOrder = await result.generateObjectForOrderCreation();
      const res = await bity?.createOrder(preparedOrder) ?? '';
      const paymentDetails = await bity?.fetchOrderWithUrl(res);
      console.log('Payment details: ', paymentDetails)
      console.log('Create order: ', res)
      console.log(result)
    }
  }

  return (
    <div className="login">
      <h1>Safe address:</h1>
      <p>{safeInfo?.safeAddress}</p>
      <p>7ZAlmqwgOtGQq_jA7jKGzw</p>
      <div>
        <input
          onChange={handleChangeKey}
          value={bityApiKey}
          placeholder="Enter bity key"
          type="text"
        />
        <div className={'login__buttons'}>
          <button onClick={handleConnectBity}>Auth</button>
          <button onClick={getAccessToken}>Get Access Token</button>
          <button onClick={handleCreateOrder}>Create Order</button>
        </div>
      </div>
    </div>
  );
}
