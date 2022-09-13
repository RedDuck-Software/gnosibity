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

const OrderComponent: FC<OrderProps> = ({ order }) => {
  return (
    <div style={{ margin: '1rem 0' }}>
      <p>Order id: {order.reference}</p>
      <p>Created at: {formatDate(order.createdAt)}</p>
    </div>
  );
};

export default OrderComponent;
