import { OrderPaymentDetailsAll } from '@bity/api/models';
import format from 'date-fns/format';
import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useBityApi } from '../../hooks/useBityApi';
import { style } from '../ExchangePage/exchangePage.styles';

const HistoryPage: FC = () => {
  const navigate = useNavigate();
  const { bityApi, connected } = useBityApi();

  const [orders, setOrders] = useState<OrderPaymentDetailsAll[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchHistory = () => {
    if (connected) {
      setLoading(true);
      bityApi
        .fetchHistory()
        .then((orders) => {
          setLoading(false);
          setOrders(orders);
        })
        .catch((e) => {
          console.log('Error while fetching history: ', e);
          setIsError(true);
        });
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [connected]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, 'MMM dd hh:mm:ss');
  };

  const handleBack = () => navigate('/');
  const handleRefresh = () => {
    fetchHistory();
  };

  return (
    <div>
      {loading && !isError && (
        <div style={{ margin: '1rem 0' }}>Loading...</div>
      )}
      {!loading && isError && (
        <div style={{ margin: '1rem 0' }}>
          Oops smth went wrong. Check console...
        </div>
      )}
      {!loading &&
        !isError &&
        orders.map((order) => (
          <div key={order.reference} style={{ margin: '1rem 0' }}>
            <p>Order id: {order.reference}</p>
            <p>Created at: {formatDate(order.createdAt)}</p>
          </div>
        ))}
      <div className="flex justify-center items-center">
        <div onClick={handleRefresh} className={style.confirmButton}>
          Refresh
        </div>
        <div onClick={handleBack} className={style.confirmButton}>
          Back
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
