import { OrderPaymentDetailsAll, PaymentDetailsCrypto } from '@bity/api/models';
import { OrderPaymentDetails } from '@bity/api/models/order-payment-details';
import { parseEther } from '@ethersproject/units';
import { useWeb3React } from '@web3-react/core';
import format from 'date-fns/format';
import React, { FC, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import {
  gnosisSafe,
  gnosisSafeHooks,
  metamask,
  metamaskHooks,
} from '../../connectors';
import { SUPPORTED_CHAIN } from '../../helpers/constants';
import { timeout } from '../../helpers/timeout';
import { useBityApi } from '../../hooks/useBityApi';
import { style } from '../../pages/ExchangePage/exchangePage.styles';
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

const { useIsActive: useIsMetamaskActive } = metamaskHooks;
const { useIsActive: useIsGnosisSafeActive } = gnosisSafeHooks;

export const OrderComponent: FC<OrderComponentProps> = ({
  order,
  fetchOrder,
}) => {
  const { bityApi } = useBityApi();
  const [signature, setSignature] = useState<string>('');
  const { provider, account } = useWeb3React();
  const isMetamaskActive = useIsMetamaskActive();
  const isGnosisSafeActive = useIsGnosisSafeActive();

  console.log(order);

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
        if (
          order.output.cryptoAddress.value?.toLowerCase() !==
          (await signer.getAddress()).toLowerCase()
        ) {
          toast('Your address is not an output address.');
          return;
        }
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

  const sendCrypto = async () => {
    if (
      provider &&
      order instanceof OrderPaymentDetails &&
      order.paymentDetails instanceof PaymentDetailsCrypto &&
      order.input.amount.value
    ) {
      const signer = await provider.getSigner(0);
      if (
        order.input.cryptoAddress.value?.toLowerCase() !==
        (await signer.getAddress()).toLowerCase()
      ) {
        toast('Your address is not input address.');
        return;
      }
      await signer
        .sendTransaction({
          to: order.paymentDetails.cryptoAddress,
          value: parseEther(order.input.amount.value),
        })
        .then((t) => t.wait());
      toast('Crypto sent.');
      await timeout(2000);
      await fetchOrder();
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
      {order.awaitingPaymentSince && (
        <div className="my-1">
          <p>
            Awaiting payment since:{' '}
            <b>{formatDate(order.awaitingPaymentSince)}</b>
          </p>
          <p>
            Payment address: <b>{formatPaymentAddress(order)}</b>{' '}
          </p>
          <p>
            To send:{' '}
            <b>{`${order.input.amount.value} ${order.input.currency.value}`}</b>
          </p>
        </div>
      )}
      {order.paymentReceivedAt && (
        <div className="my-1">
          <p>
            Payment received at: <b>{formatDate(order.paymentReceivedAt)}</b>
          </p>
        </div>
      )}
      <p>Sender address: {order.input.cryptoAddress.value}</p>
      <p>Getting address: {order.output.cryptoAddress.value}</p>
      <p>
        To get: {order.output.amount.value} {order.output.currency.value}
      </p>
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
      <RenderIf
        condition={
          !needToSign &&
          !!order.awaitingPaymentSince &&
          !order.paymentReceivedAt
        }
      >
        <div className="flex items-center">
          <RenderIf condition={!isMetamaskActive}>
            <button
              className={style.copyButton}
              onClick={async () => {
                if (isGnosisSafeActive) {
                  await gnosisSafe.resetState();
                }
                return metamask.activate(SUPPORTED_CHAIN);
              }}
            >
              Connect Metamask
            </button>
          </RenderIf>
          <RenderIf condition={!isGnosisSafeActive}>
            <button
              className={style.copyButton}
              onClick={async () => {
                if (isMetamaskActive) {
                  await metamask.resetState();
                }
                return gnosisSafe.activate();
              }}
            >
              Connect Gnosis Safe
            </button>
          </RenderIf>
        </div>
        <RenderIf
          condition={(isMetamaskActive || isGnosisSafeActive) && !!account}
        >
          <div>
            <button
              className={style.copyButton}
              onClick={() => {
                if (isMetamaskActive) {
                  return metamask.resetState();
                }
                if (isGnosisSafeActive) {
                  return gnosisSafe.resetState();
                }
              }}
            >
              Disconnect wallet
            </button>
          </div>
          <div className="flex flex-col">
            <p className="mx-2">Connected address: {account}</p>
            <button className={style.copyButton} onClick={sendCrypto}>
              Send crypto
            </button>
          </div>
        </RenderIf>
      </RenderIf>
    </div>
  );
};
