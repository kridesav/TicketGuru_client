import React from 'react';
import TokenFetchPOC, { TokenContext } from './components/TokenFetchPOC';
import './App.css';
import TicketForm from './components/TicketForm';

function App() {
  return (
    <TokenFetchPOC>
      <TicketForm />
    </TokenFetchPOC>
  );
}

export { TokenContext };
export default App;