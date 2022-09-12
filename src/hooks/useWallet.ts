import * as providers from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useMemo } from 'react';

import { SUPPORTED_CHAINS } from '../helpers/constants';

export const useWallet = () => {
  const connector = useMemo(
    () =>
      new InjectedConnector({
        supportedChainIds: SUPPORTED_CHAINS,
      }),
    [],
  );

  const { chainId, account, active, activate, deactivate, library } =
    useWeb3React();

  const activateWallet = async () => {
    try {
      await activate(connector, undefined, true);
    } catch (e) {
      console.error('Error while connecting wallet: ', e);
    }
  };

  const deactivateWallet = () => {
    deactivate();
  };

  return {
    chainId,
    account: account ?? '',
    active,
    activate: activateWallet,
    deactivate: deactivateWallet,
    provider: library as providers.Web3Provider,
  };
};
