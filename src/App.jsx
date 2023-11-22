import React, { useContext, useEffect, useState } from 'react';
import TokenFetchPOC, { TokenContext } from './components/TokenFetchPOC';
import { AppBar, Box, Tab, Tabs, CssBaseline } from '@mui/material';
import './App.css';
import TicketForm from './components/TicketForm';
import CreateEvent from './components/CreateEvent';
import CheckTicket from './components/TicketCheck';
import ControlPanel from './components/ControlPanel';

function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <TokenFetchPOC>
      <CssBaseline />
      <AppBar position="fixed" color="default">
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label="Sell Tickets" sx={{ '&:focus': { outline: 'none' } }} />
            <Tab label="New event" sx={{ '&:focus': { outline: 'none' } }}/>
            <Tab label="Check Ticket" sx={{ '&:focus': { outline: 'none' } }}/>
            <Tab label="Control Panel" disabled={true} sx={{ '&:focus': { outline: 'none' } }}/>
          </Tabs>
        </Box>
      </AppBar>
      <Box sx={{ marginTop: 8 }}>
        {value === 0 && <TicketForm />}
        {value === 1 && <CreateEvent />}
        {value === 2 && <CheckTicket />}
        {value === 3 && <ControlPanel />}
      </Box>
    </TokenFetchPOC>
  );
}

export { TokenContext };
export default App;