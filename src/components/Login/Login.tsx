import React, { ChangeEvent, FC, useEffect, useState } from "react";
import { SafeInfo } from "@gnosis.pm/safe-apps-sdk";
import { BityApiClientInterface } from "@bity/api";
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

  const handleConnectBity = async () => {
    const connectedBity = await connectBity(bityApiKey);
    setBity(connectedBity);
    setIsOrderSectionHidden(false);
  }

  async function handleCreateOrder() {
    const result = createOrder();
    const preparedOrder = await result.generateObjectForOrderCreation();
    const res = await bity?.createOrder(preparedOrder) ?? '';
    const paymentDetails = await bity?.fetchOrderWithUrl(res);
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
        <button onClick={handleConnectBity}>Auth</button>
      </div>
      {!isOrderSectionHidden && <button onClick={handleCreateOrder}>Order</button>}
    </div>
  );
}
