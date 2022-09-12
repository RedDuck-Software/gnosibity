import * as providers from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Login } from './components/Login/Login';
import ExchangePage from './pages/ExchangePage/ExchangePage';
import ErrorPage from './pages/LoginErrorPage/LoginErrorPage';

const getLibrary = (
  provider: providers.ExternalProvider | providers.JsonRpcFetchFunc,
) => new providers.Web3Provider(provider);

function App() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/exchange-page" element={<ExchangePage />} />
          <Route path="/error-page" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </Web3ReactProvider>
  );
}

export default App;
