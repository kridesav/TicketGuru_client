import React, { useContext, useEffect, useState } from 'react';
import TokenFetchPOC, { TokenContext } from './components/TokenFetchPOC';
import { AppBar, Box, Tab, Tabs, CssBaseline } from '@mui/material';
import './App.css';
import TicketForm from './components/TicketForm';
import CreateEvent from './components/CreateEvent';
import CheckTicket from './components/TicketCheck';
import ControlPanel from './components/ControlPanel';

function App() {
  const { logout, role } = useContext(TokenContext);
  const [value, setValue] = useState(0);

  const tabs = [
    { label: "Sell Tickets", roles: ["user", "admin"], component: TicketForm },
    { label: "New event", roles: ["admin"], component: CreateEvent },
    { label: "Check Ticket", roles: ["admin", "scanner", "user"], component: CheckTicket },
    { label: "Control Panel", roles: ["admin"], component: ControlPanel },
    { label: "Logout", roles: ["user", "admin", "scanner"] }
  ];

  const handleChange = (event, newValue) => {
    if (allowedTabs[newValue].label === 'Logout') {
      logout();
    } else {
      setValue(newValue);
    }
  };

  const allowedTabs = tabs.filter(tab => tab.roles.includes(role));

  return (
    <>
      <CssBaseline />
      <AppBar position="fixed" color="default">
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tabs value={value} onChange={handleChange}>
            {allowedTabs.map((tab, index) => (
              <Tab key={index} label={tab.label} sx={{ '&:focus': { outline: 'none' } }} />
            ))}
          </Tabs>
        </Box>
      </AppBar>
      <Box sx={{ marginTop: 8 }}>
        {allowedTabs[value] && allowedTabs[value].component && React.createElement(allowedTabs[value].component)}
      </Box>
    </>
  );
}

export { TokenContext };
export default App;