import React, { useContext, useState } from 'react';
import FetchData from "./FetchData";
import OrderSummary from './OrderSummary';
import { TokenContext } from '../App';
import './TicketForm.css';


export default function TicketForm() {
  const token = useContext(TokenContext);
  const [events, setEvents] = useState([]);
  const [eventTicketTypes, setEventTicketTypes] = useState({});
  const [selectedTickets, setSelectedTickets] = useState({});


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


  const handlePurchase = () => {
    // Oston toteutus 
    // Vahvistusviesti käyttäjälle lisätä
    console.log('Osto tehty!', selectedTickets);
  };

  return (
    <div>
      <h1>TicketForm</h1>
      <FetchData url="https://ticketguru-ticketmaster.rahtiapp.fi/api/events" setData={setEvents} token={token}/>
      <FetchData url="https://ticketguru-ticketmaster.rahtiapp.fi/api/tickettypes" setEventTicketTypes={setEventTicketTypes} token={token}/>
      
      <h2>Buy tickets to events</h2>
      {events.map(event => (
        <div className="event-info" key={event.id}>
          <h4>{event.name}</h4>
          <p>Date: {new Date(event.eventDate).toLocaleDateString()}</p>
          <p>Ticket Types:</p>
          <ul>
            {eventTicketTypes[event.id]?.map(ticketType => (
              <li key={ticketType.id}>
                {ticketType.description}: {ticketType.price} €  
                <select
                  className='select'
                  value={selectedTickets[event.id]?.[ticketType.id] || 0}
                  onChange={(e) =>
                    handleTicketChange(event.id, ticketType.id, parseInt(e.target.value))
                  }
                >
                  {[...Array(11).keys()].map((quantity) => (
                    <option key={quantity} value={quantity}>
                      {quantity}
                    </option>
                  ))}
                </select>
                    <p className='select-text'></p>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div>
      <OrderSummary selectedTickets={selectedTickets} eventTicketTypes={eventTicketTypes} />
        <button className="button" onClick={handlePurchase}>Buy tickets</button>
      </div>
    </div>
  );
}