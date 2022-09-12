import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { SafeInfo } from "@gnosis.pm/safe-apps-sdk";
import { BityApiClient, BityApiClientInterface } from "@bity/api";
import { loadSdk } from "../../helpers/loadSdk";
import { connectBity } from "../../helpers/connectBity";
import { createOrder } from "../../helpers/createOrder";
import { useNavigate } from 'react-router-dom';

import './styles.css';



export const Login: FC = () => {

  const btn = 'bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded w-5/6'
  const storedKey = localStorage.getItem('bity-key')
    ? JSON.parse(localStorage.getItem('bity-key') ?? '')
    : '';

  const [safeInfo, setSafeInfo] = useState<SafeInfo>();
  const [bityApiKey, setBityApiKey] = useState<string>(storedKey);
  const [isOrderSectionHidden, setIsOrderSectionHidden] = useState<boolean>(true);
  const [bity, setBity] = useState<BityApiClientInterface | null>(null);
  const navigate = useNavigate();

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
    if (typeof oauthState === 'string') {
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
    if (safeInfo?.safeAddress) {
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
    <div className="flex flex-col text-center ">
      <h1>Safe address:</h1>
      <p>{safeInfo?.safeAddress}</p>
      <p >7ZAlmqwgOtGQq_jA7jKGzw</p>
      <div>
        <input
          className={btn}
          onChange={handleChangeKey}
          value={bityApiKey}
          placeholder="Enter bity key"
          type="text"
        />
        <div className="flex flex-col items-center">
          <button className={btn} onClick={handleConnectBity}>Auth</button>
          <button className={btn} onClick={getAccessToken}>Get Access Token</button>
          <button className={btn} onClick={handleCreateOrder}>Create Order</button>
          <button className={btn} onClick={() => navigate('/exchange-page')}>Create order page</button>
          <button className={btn} onClick={() => navigate('/error-page')}>Error Page</button>

        </div>
      </div>
    </div>
  );
}
