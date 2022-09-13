import { CurrencyAndAmount } from '@bity/api/models';
import { OrderPaymentDetails } from '@bity/api/models/order-payment-details';
import React, { FC, useEffect, useState } from 'react';
import { AiOutlineDown } from 'react-icons/ai';
import { BsCurrencyExchange } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

import { style } from './exchangePage.styles';

import EthLogo from '../../assets/eth.png';
import UsdtLogo from '../../assets/tether-usdt-logo.png';
import { createOrder } from '../../helpers/createOrder';
import { useBityApi } from '../../hooks/useBityApi';
import { useWallet } from '../../hooks/useWallet';

type Metadata = {
  value: string | undefined;
  txCost: CurrencyAndAmount | undefined;
  fee: CurrencyAndAmount | undefined;
};

const ExchangePage: FC = () => {
  const SENDING_CURRENCY = 'ETH';
  const GETTING_CURRENCY = 'USDT';

  const navigate = useNavigate();
  const { active, account, activate, provider } = useWallet();
  const { bityApi } = useBityApi();
  const [toAddress, setToAddress] = useState<string>('');
  const [fromValue, setFromValue] = useState<number>(1);
  const [toValue, setToValue] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [txCost, setTxCost] = useState<CurrencyAndAmount>({
    amount: '0',
    currency: GETTING_CURRENCY,
  });
  const [fee, setFee] = useState<CurrencyAndAmount>({
    amount: '0',
    currency: SENDING_CURRENCY,
  });
  const handleConnectWallet = () => activate();

  const fetchMetadata = async (amountIn: number): Promise<Metadata> => {
    const preparedOrder = await createOrder(
      'account',
      'toAddress',
      SENDING_CURRENCY,
      GETTING_CURRENCY,
      amountIn,
      1,
    );
    const exchangeRate = await bityApi.fetchOrderExchangeRate(preparedOrder);
    return {
      value: exchangeRate.output.amount.value,
      txCost: exchangeRate.priceBreakdown?.outputTransactionCost,
      fee: exchangeRate.priceBreakdown?.customerTradingFee,
    };
  };

  const displayMetadata = (metadata: Metadata) => {
    const price = parseFloat(metadata.value || '0');
    setPrice(price);
    setToValue(price);
    if (metadata.txCost) {
      setTxCost(metadata.txCost);
    }
    if (metadata.fee) {
      setFee(metadata.fee);
    }
  };

  useEffect(() => {
    fetchMetadata(1).then((metadata) => {
      displayMetadata(metadata);
    });
  }, []);

  useEffect(() => {
    if (fromValue) {
      fetchMetadata(fromValue).then((metadata) => {
        displayMetadata(metadata);
      });
    }
  }, [fromValue]);

  const handleExchange = async () => {
    const preparedOrder = await createOrder(
      account,
      toAddress,
      SENDING_CURRENCY,
      GETTING_CURRENCY,
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
              disabled
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
            value={fromValue}
            onChange={(e) => setFromValue(+e.target.value)}
          />
          <div className={style.currencySelector}>
            <div className={style.currencySelectorContent}>
              <div className={style.currencySelectorIcon}>
                <img src={EthLogo} alt="" />
              </div>
              <div className={style.currencySelectorTicker}>
                {SENDING_CURRENCY}
              </div>
            </div>
          </div>
        </div>
        <div className={style.transferPropContainer}>
          <input
            type="number"
            className={style.transferPropInput}
            placeholder="You GET"
            value={toValue}
            disabled
          />
          <div className={style.currencySelector}>
            <div className={style.currencySelectorContent}>
              <div className={style.currencySelectorIcon}>
                <img src={UsdtLogo} alt="" />
                <AiOutlineDown className={style.currencySelectorArrow} />
              </div>
              <div className={style.currencySelectorTicker}>
                {GETTING_CURRENCY}
              </div>
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
          <li className={style.liStyles}>
            Trading fee: {fee.amount} {fee.currency}
          </li>
          <li className={style.liStyles}>
            Cryptocurrency transaction cost {txCost.amount} {txCost.currency}
          </li>
          <li className={style.liStyles}>Exchange rate 1 / {price ?? 0}</li>
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
