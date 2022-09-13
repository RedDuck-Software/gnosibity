import { OrderPaymentDetailsAll, PaymentDetailsCrypto } from '@bity/api/models';
import { OrderPaymentDetails } from '@bity/api/models/order-payment-details';
import { useWeb3React } from '@web3-react/core';
import format from 'date-fns/format';
import React, { FC, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import { metamask, metamaskHooks } from '../../connectors';
import { SUPPORTED_CHAIN } from '../../helpers/constants';
import { timeout } from '../../helpers/timeout';
import { useBityApi } from '../../hooks/useBityApi';
import { RenderIf } from '../RenderIf';
import { SignMessage } from '../SignMessage';

interface OrderComponentProps {
  order: OrderPaymentDetailsAll;
  fetchOrder: () => void | Promise<void>;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'MMM dd hh:mm:ss');
};

const formatPrice = (order: OrderPaymentDetailsAll): string =>
  (parseFloat(order.output.amount.value ?? '0').toFixed(3) ?? '')
    .concat(' ' + order.output.currency.value ?? '')
    .concat(' / ')
    .concat(parseFloat(order.input.amount.value ?? '0').toFixed(3))
    .concat(' ' + order.input.currency.value ?? '0');

const formatFee = (order: OrderPaymentDetailsAll): string =>
  (
    parseFloat(order.priceBreakdown?.customerTradingFee?.amount ?? '0') +
    parseFloat(order.priceBreakdown?.nonVerifiedFee?.amount ?? '0')
  ).toString();

const formatOutputTransactionCost = (order: OrderPaymentDetailsAll): string =>
  (order.priceBreakdown?.outputTransactionCost?.amount ?? '0') +
  ' ' +
  (order.priceBreakdown?.outputTransactionCost?.currency ?? '');

const formatPaymentAddress = (order: OrderPaymentDetailsAll): string => {
  if (order instanceof OrderPaymentDetails) {
    if (order.paymentDetails instanceof PaymentDetailsCrypto) {
      return order.paymentDetails.cryptoAddress;
    }
  }
  return '-';
};

const { useIsActive } = metamaskHooks;

export const OrderComponent: FC<OrderComponentProps> = ({
  order,
  fetchOrder,
}) => {
  const { bityApi } = useBityApi();
  const [signature, setSignature] = useState<string>('');
  const { provider } = useWeb3React();
  const isMetamaskActive = useIsActive();

  const needToSign = useMemo(() => {
    if (order instanceof OrderPaymentDetails) {
      return !!order.messageToSign;
    }
    return false;
  }, [order]);

  const connectWallet = async () => {
    try {
      await metamask.activate(SUPPORTED_CHAIN);
      toast('Wallet connected.');
    } catch (e) {
      console.error('Unable to connect wallet: ', e);
    }
  };

  const signMessage = async () => {
    try {
      if (
        provider &&
        order instanceof OrderPaymentDetails &&
        order.messageToSign
      ) {
        const signer = await provider.getSigner(0);
        const sig = await signer.signMessage(order.messageToSign.text);
        setSignature(sig);
        toast('Signed.');
      }
    } catch (e) {
      console.error('Unable to sign message: ', e);
    }
  };

  const verifySignature = async () => {
    if (
      order instanceof OrderPaymentDetails &&
      order.messageToSign?.verificationUrl
    ) {
      try {
        await bityApi.verifySignature(
          order.messageToSign.verificationUrl,
          signature,
        );
        toast('Signature verified.');
        await timeout(2000);
        await fetchOrder();
      } catch (e) {
        console.error('Unable to verify signature: ', e);
      }
    }
  };

  return (
    <div>
      <p>Order id: {order.reference}</p>
      <p>
        Sender email:{' '}
        {order.contactPerson.email.value == ''
          ? '-'
          : order.contactPerson.email.value}
      </p>
      <p>Created at: {formatDate(order.createdAt)}</p>
      <p>Exchange rate: {formatPrice(order)}</p>
      <p>
        Payment address: <b>{formatPaymentAddress(order)}</b>{' '}
      </p>

      <p>Sender address: {order.input.cryptoAddress.value}</p>
      <p>Getting address: {order.output.cryptoAddress.value}</p>
      <p>
        Total fee: {formatFee(order)}{' '}
        {order.priceBreakdown?.customerTradingFee?.currency}
      </p>
      <p>Trans. cost: {formatOutputTransactionCost(order)} </p>
      <RenderIf condition={needToSign}>
        <SignMessage
          messageToSign={
            (order as OrderPaymentDetails).messageToSign?.text || ''
          }
          onChange={(signature) => setSignature(signature)}
          onVerify={verifySignature}
          signature={signature}
          onSignMessage={signMessage}
          provider={isMetamaskActive ? provider : undefined}
          connectWallet={connectWallet}
        />
      </RenderIf>
    </div>
  );
};
