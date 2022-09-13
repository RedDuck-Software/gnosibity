import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core';
import { GnosisSafe } from '@web3-react/gnosis-safe';
import { MetaMask } from '@web3-react/metamask';
import React, { FC, PropsWithChildren } from 'react';

import {
  gnosisSafe,
  gnosisSafeHooks,
  metamask,
  metamaskHooks,
} from './connectors';

const connectors: [MetaMask | GnosisSafe, Web3ReactHooks][] = [
  [metamask, metamaskHooks],
  [gnosisSafe, gnosisSafeHooks],
];

const WalletProvider: FC<PropsWithChildren> = ({ children }) => (
  <Web3ReactProvider connectors={connectors}>{children}</Web3ReactProvider>
);

export default WalletProvider;
