import { OrderPaymentDetailsAll } from '@bity/api/models';
import format from 'date-fns/format';
import React, { FC } from 'react';

interface OrderProps {
  order: OrderPaymentDetailsAll;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return format(date, 'MMM dd hh:mm:ss');
};

const formatPrice = (order: OrderPaymentDetailsAll): string => {
  const price =  (parseFloat(order.output.amount.value ?? '0').toFixed(3) ?? '').concat(' ' + order.output.currency.value ?? '').concat("/").concat(parseFloat(order.input.amount.value ?? '0').toFixed(3))
  .concat(' ' + order.input.currency.value ?? '0');
  return price;
};

const formatFee = (order: OrderPaymentDetailsAll): string => {
  const fee = (parseFloat(order.priceBreakdown?.customerTradingFee?.amount ?? '0') + parseFloat(order.priceBreakdown?.nonVerifiedFee?.amount ?? '0')).toString();
  return fee;
};

const formatOutputTransactionCost = (order: OrderPaymentDetailsAll): string => {
  const cost = (order.priceBreakdown?.outputTransactionCost?.amount?? '0') + ' ' +(order.priceBreakdown?.outputTransactionCost?.currency ?? '');
  return cost;
};

const formatPaymentAddress = (order: OrderPaymentDetailsAll): string => {
  let address = "-";
  order.do(payMetadata => address = payMetadata.paymentDetails.value);
  return address;
};
const OrderComponent: FC<OrderProps> = ({ order }) => {
  return (
    <div style={{ margin: '1rem 0' }}>
      <p>Order id: {order.reference}</p>
      <p>Sender email: {order.contactPerson.email.value == '' ? '-' : order.contactPerson.email.value}</p>
      <p>Created at: {formatDate(order.createdAt)}</p>
      <p>Exchange rate: {formatPrice(order)}</p>
      <p>Payment address: {formatPaymentAddress(order)} </p>

      <p>Sender address: <b>{order.input.cryptoAddress.value}</b></p>
      <p>Getting address: <b>{order.output.cryptoAddress.value} </b></p>
      <p>Total fee: {formatFee(order)} {order.priceBreakdown?.customerTradingFee?.currency}</p>
      <p>Trans. cost: {formatOutputTransactionCost(order)} </p>
    </div>
  );
};

export default OrderComponent;
