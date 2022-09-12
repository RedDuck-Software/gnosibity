import { OrderPaymentDetails } from '@bity/api/models/order-payment-details';
import React, { FC, useState } from 'react';
import { AiOutlineDown } from 'react-icons/ai';
import { BsCurrencyExchange } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

import { style } from './exchangePage.styles';

import BtcLogo from '../../assets/btc.png';
import EthLogo from '../../assets/eth.png';
import { createOrder } from '../../helpers/createOrder';
import { useBityApi } from '../../hooks/useBityApi';
import { useWallet } from '../../hooks/useWallet';

const ExchangePage: FC = () => {
  const navigate = useNavigate();
  const { active, account, activate, provider } = useWallet();
  const { bityApi } = useBityApi();
  const [toAddress, setToAddress] = useState<string>('');
  const [fromValue, setFromValue] = useState<number>(0);
  const [toValue, setToValue] = useState<number>(0);

  const handleConnectWallet = () => activate();

  const handleExchange = async () => {
    const preparedOrder = await createOrder(
      account,
      toAddress,
      'ETH',
      'BTC',
      fromValue,
      toValue,
    );
    console.log('Prepared order: ', preparedOrder);
    const orderUrl = await bityApi.createOrder(preparedOrder);
    console.log('Order URL: ', orderUrl);
    const paymentDetails = await bityApi.fetchOrderWithUrl(orderUrl);
    console.log('Payment details: ', paymentDetails);
    try {
      if (
        paymentDetails instanceof OrderPaymentDetails &&
        paymentDetails.messageToSign
      ) {
        const { text, verificationUrl } = paymentDetails.messageToSign;
        const signature = await (await provider.getSigner(0)).signMessage(text);
        await bityApi.verifySignature(verificationUrl, signature);
      }
      const paymentDetailsAfterVerification = await bityApi.fetchOrderWithUrl(
        orderUrl,
      );
      console.log(
        'Payment details after verification: ',
        paymentDetailsAfterVerification,
      );
    } catch (e) {
      console.error('Error in verification: ', e);
    }
  };

  const handleBack = () => navigate('/');

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <div>Exchange </div>
          <BsCurrencyExchange />
        </div>
        <div className={style.transferPropContainer}>
          {active ? (
            <input
              type="text"
              className={style.transferPropInput}
              placeholder="Your address"
              defaultValue={account}
            />
          ) : (
            <button onClick={handleConnectWallet}>Connect wallet</button>
          )}
        </div>
        <div className={style.transferPropContainer}>
          <input
            type="number"
            className={style.transferPropInput}
            placeholder="You SEND"
            onChange={(e) => setFromValue(+e.target.value)}
          />
          <div className={style.currencySelector}>
            <div className={style.currencySelectorContent}>
              <div className={style.currencySelectorIcon}>
                <img src={EthLogo} alt="" />
              </div>
              <div className={style.currencySelectorTicker}>ETH</div>
            </div>
          </div>
        </div>
        <div className={style.transferPropContainer}>
          <input
            type="number"
            className={style.transferPropInput}
            placeholder="You GET"
            onChange={(e) => setToValue(+e.target.value)}
          />
          <div className={style.currencySelector}>
            <div className={style.currencySelectorContent}>
              <div className={style.currencySelectorIcon}>
                <img src={BtcLogo} alt="" />
                <AiOutlineDown className={style.currencySelectorArrow} />
              </div>
              <div className={style.currencySelectorTicker}>BTC</div>
            </div>
          </div>
        </div>
        <div className={style.transferPropContainer}>
          <input
            type="text"
            className={style.transferPropInput}
            placeholder="Address to"
            onChange={(e) => setToAddress(e.target.value)}
          />
        </div>
        <ul className={style.ulStyles}>
          <li className={style.liStyles}>Trading fee: 1.60 CFH</li>
          <li className={style.liStyles}>
            Cryptocurrency transaction cost 0.000025 BTC
          </li>
          <li className={style.liStyles}>Exchange rate 0.077/1</li>
        </ul>

        <div onClick={handleExchange} className={style.confirmButton}>
          Exchange
        </div>
        <div onClick={handleBack} className={style.confirmButton}>
          Back
        </div>
      </div>
    </div>
  );
};

export default ExchangePage;
