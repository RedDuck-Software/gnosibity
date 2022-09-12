import * as providers from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ExchangePage from './pages/ExchangePage/ExchangePage';
import HistoryPage from './pages/HistoryPage/HistoryPage';
import ErrorPage from './pages/LoginErrorPage/LoginErrorPage';
import LoginPage from './pages/LoginPage/LoginPage';

const getLibrary = (
  provider: providers.ExternalProvider | providers.JsonRpcFetchFunc,
) => new providers.Web3Provider(provider);

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/exchange-page" element={<ExchangePage />} />
          <Route path="/error-page" element={<ErrorPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </BrowserRouter>
    </Web3ReactProvider>
  );
}

export default App;
