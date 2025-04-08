import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { HashRouter } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import store from './redux/store.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </HelmetProvider>
    </Provider>
  </StrictMode>,
)