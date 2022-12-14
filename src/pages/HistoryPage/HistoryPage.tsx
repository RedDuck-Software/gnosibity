import { OrderPaymentDetailsAll } from '@bity/api/models';
import React, { FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
          <Link
            className="block my-2 p-3 hover:text-blue-600 text-black bg-gray-100 rounded hover:underline flex justify-center items-center"
            key={order.reference}
            to={`/order/${order.reference}`}
          >
            {order.reference}
          </Link>
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
