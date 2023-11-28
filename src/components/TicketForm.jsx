import React, { useContext, useState } from 'react';
import FetchData from "./FetchData";
import OrderSummary from './OrderSummary';
import FetchPost from './FetchPost';
import { TokenContext } from '../App';
import TicketWindow from './PurchasedTickets';
import { Typography, Box, List, ListItem, Select, MenuItem, Button, Collapse, ListItemButton, Grid, Container } from '@mui/material';
import './TicketForm.css';


export default function TicketForm() {
  const { token } = useContext(TokenContext);
  const [events, setEvents] = useState([]);
  const [eventTicketTypes, setEventTicketTypes] = useState({});
  const [selectedTickets, setSelectedTickets] = useState({});
  const [ticketData, setTicketData] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const handleEventClick = (id) => {
    setSelectedEventId(selectedEventId === id ? null : id);
  };

  // Function that updates the selectedTickets 
  const handleTicketChange = (eventId, ticketTypeId, value) => {
    setSelectedTickets((prev) => ({
      ...prev,
      [eventId]: {
        ...(prev[eventId] || {}),
        [ticketTypeId]: value,
      },
    }));
  };

  // Purchase was ok
  const handlePurchaseSuccess = (responseData) => {
    console.log('The purchase was successful!', responseData);
    setSelectedTickets({});
    setTicketData(responseData);
  };


  // Error when buying tickets
  const handlePurchaseError = () => {
    console.error('The purchase failed to process');
    alert('The purchase failed. Please try again');
    return;
  };

  const areTicketsSelected = Object.values(selectedTickets).some(event =>
    Object.values(event).some(quantity => quantity > 0)
  );

  return (
    <Container maxWidth="lg">
      <Box>
        {ticketData && <TicketWindow tickets={ticketData} />}
        <Typography variant="h2">All events</Typography>
        <FetchData url="https://ticketguru-ticketmaster.rahtiapp.fi/api/events" setData={setEvents} token={token} />
        <FetchData url="https://ticketguru-ticketmaster.rahtiapp.fi/api/tickettypes" setEventTicketTypes={setEventTicketTypes} token={token} />

        <Grid container spacing={13}>
          <Grid item xs={12} md={8}>
            <List className='eventsList'>
              {events.map(event => (
                <div key={event.id}>
                  <ListItemButton onClick={() => handleEventClick(event.id)}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
                      <Typography variant="h4">{event.name}</Typography>
                      <Typography variant="body1">{new Date(event.eventDate).toLocaleDateString()}</Typography>
                      <Typography variant="body1">{event.place}</Typography>
                      <Typography variant="body1">Tickets left: {event.ticketAmount}</Typography>
                    </Box>
                  </ListItemButton>
                  <Collapse in={selectedEventId === event.id}>
                    <List>
                      {eventTicketTypes[event.id]?.map(ticketType => (
                        <ListItem key={ticketType.id}>
                        <Box sx={{ flexGrow: 1 }}>
                          {ticketType.description}: {ticketType.price} €
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <Button
                            size="small"
                            onClick={() =>
                              handleTicketChange(event.id, ticketType.id, Math.max((selectedTickets[event.id]?.[ticketType.id] || 0) - 1, 0))
                            }
                            sx={{ '&:focus': { outline: 'none' } }}
                          >
                            -
                          </Button>
                          <Typography>{selectedTickets[event.id]?.[ticketType.id] || 0}</Typography>
                          <Button
                            size="small"
                            onClick={() =>
                              handleTicketChange(event.id, ticketType.id, (selectedTickets[event.id]?.[ticketType.id] || 0) + 1)
                            }
                            sx={{ '&:focus': { outline: 'none' } }}
                          >
                            +
                          </Button>
                        </Box>
                      </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </div>
              ))}
            </List>
          </Grid>
          <Grid item xs={6} md={4}>
            <Box sx={{ width: '400px', height: '600px', overflow: 'auto' }}>
              <OrderSummary selectedTickets={selectedTickets} eventTicketTypes={eventTicketTypes} events={events} />
              <FetchPost
                url="https://ticketguru-ticketmaster.rahtiapp.fi/api/tickets"
                token={token}
                data={{
                  customerId: 1,
                  ticketsDTO: Object.keys(selectedTickets).reduce((acc, eventId) => {
                    return acc.concat(
                      Object.keys(selectedTickets[eventId]).map((ticketTypeId) => ({
                        eventId: parseInt(eventId),
                        ticketTypeId: parseInt(ticketTypeId),
                        ticketAmount: selectedTickets[eventId][ticketTypeId],
                      }))
                    );
                  }, []),
                }}
                onSuccess={handlePurchaseSuccess}
                onError={handlePurchaseError}
                noTicketsSelected={!areTicketsSelected}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
