import { OrderPaymentDetailsAll } from '@bity/api/models';
import React, { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';

import { OrderComponent } from '../../components/OrderComponent';
import { useBityApi } from '../../hooks/useBityApi';
import { style } from '../ExchangePage/exchangePage.styles';

const OrderPage: FC = () => {
  const navigate = useNavigate();
  const { reference } = useParams<{ reference: string }>();
  const [order, setOrder] = useState<OrderPaymentDetailsAll | null>(null);
  const { bityApi, connected } = useBityApi();

  const fetchOrder = () => {
    if (connected && reference) {
      bityApi.fetchOrderByReference(reference).then((order) => {
        setOrder(order);
      });
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [reference, connected, bityApi]);

  const handleBack = () => navigate('/history');

  return (
    <div style={{ margin: '1rem 0' }}>
      {order ? (
        <OrderComponent fetchOrder={fetchOrder} order={order} />
      ) : (
        <p>Loading...</p>
      )}
      <div className="flex justify-center items-center">
        <div onClick={handleBack} className={style.confirmButton}>
          Back
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
