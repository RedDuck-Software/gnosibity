import { useEffect, useState } from 'react';

import { BityApi, UnconnectedBityApi } from '../api/bity';
import { OAUTH_KEY_NAME } from '../helpers/constants';
import { getFromLocalStorage } from '../helpers/localStorage';

export const useBityApi = () => {
  const unconnectedBityApi = UnconnectedBityApi.getInstance();

  const [bityApi, setBityApi] = useState<BityApi>(BityApi.getInstance());
  const [connected, setConnected] = useState<boolean>(false);

  const connect = () => {
    if (!bityApi || !bityApi.isConnected()) {
      unconnectedBityApi.connect().then((bityApi) => {
        setBityApi(bityApi);
        setConnected(true);
      });
      return;
    }
    if (bityApi && bityApi.isConnected()) {
      setConnected(true);
    }
  };

  useEffect(() => {
    if (getFromLocalStorage(OAUTH_KEY_NAME)) {
      connect();
    }
  }, []);

  return {
    bityApi,
    connected,
    connect,
  };
};
