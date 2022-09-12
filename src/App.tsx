import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Login } from './components/Login/Login';
import ExchangePage from './pages/ExchangePage/ExchangePage';
import ErrorPage from './pages/LoginErrorPage/LoginErrorPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/exchange-page" element={<ExchangePage />} />
        <Route path="/error-page" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
