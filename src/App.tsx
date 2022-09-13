import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ExchangePage from './pages/ExchangePage/ExchangePage';
import HistoryPage from './pages/HistoryPage/HistoryPage';
import ErrorPage from './pages/LoginErrorPage/LoginErrorPage';
import LoginPage from './pages/LoginPage/LoginPage';
import WalletProvider from './WalletProvider';

function App() {
  return (
    <WalletProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/exchange-page" element={<ExchangePage />} />
          <Route path="/error-page" element={<ErrorPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
}

export default App;
