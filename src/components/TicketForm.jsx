import React, { useContext, useState } from 'react';
import FetchData from "./FetchData";
import { TokenContext } from '../App';

export default function TicketForm() {
  const token = useContext(TokenContext);
  const [events, setEvents] = useState([]);
  const [eventTicketTypes, setEventTicketTypes] = useState({});

  return (
    <div>
      <h1>TicketForm</h1>
      <FetchData url="https://ticketguru-ticketmaster.rahtiapp.fi/api/events" setData={setEvents} token={token}/>
      
      <h2>Events</h2>
      {events.map(event => (
        <div key={event.id}>
          <h3>{event.name}</h3>
          <FetchData url="https://ticketguru-ticketmaster.rahtiapp.fi/api/events" setData={setEventTicketTypes} token={token} eventId={event.id}/>
          <p>Ticket Types:</p>
          <ul>
            {eventTicketTypes[event.id]?.map(ticketType => (
              <li key={ticketType.id}>{ticketType.description}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}