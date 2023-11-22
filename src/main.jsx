import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import TokenFetchPOC from './components/TokenFetchPOC.jsx';

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <TokenFetchPOC>
      <App />
    </TokenFetchPOC>
  </React.StrictMode>
);