import { SafeInfo } from '@gnosis.pm/safe-apps-sdk';
import React, { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ModalWindow from '../../components/ModalWindow/ModalWindow';
import { loadSdk } from '../../helpers/loadSdk';
import './styles.css';
import { useBityApi } from '../../hooks/useBityApi';

const LoginPage: FC = () => {
  const btn =
    'bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded w-5/6 mt-1';

  const [safeInfo, setSafeInfo] = useState<SafeInfo>();
  const { connected, connect } = useBityApi();
  const navigate = useNavigate();
  const [isModalShown, setIsModalShown] = useState(false);

  useEffect(() => {
    loadSdk().then((info) => {
      setSafeInfo(info);
    });
  }, []);

  const handleConnectBity = () => connect();

  return (
    <div className="flex flex-col text-center ">
      <h1>Safe address:</h1>
      <p>{safeInfo?.safeAddress}</p>
      <div>
        <div className="flex flex-col items-center">
          <div>
            <p>Is bity connected: {connected ? 'true' : 'false'}</p>
          </div>
          {!connected && (
            <button className={btn} onClick={handleConnectBity}>
              Auth
            </button>
          )}
          {connected && (
            <>
              <button
                className={btn}
                onClick={() => navigate('/exchange-page')}
              >
                Create order page
              </button>
              <button className={btn} onClick={() => navigate('/history')}>
                History Page
              </button>
            </>
          )}

          <button className={btn} onClick={() => navigate('/error-page')}>
            Error Page
          </button>
          <button className={btn} onClick={() => setIsModalShown(true)}>
            SHOW MODAL
          </button>
          {isModalShown ? <ModalWindow setIsShown={setIsModalShown} /> : ' '}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
