import React, { useContext, useState } from 'react';
import FetchData from "./FetchData";
import { TokenContext } from '../App';
import './TicketForm.css';

export default function TicketForm() {
  const token = useContext(TokenContext);
  const [events, setEvents] = useState([]);
  const [eventTicketTypes, setEventTicketTypes] = useState({});
  const [selectedTickets, setSelectedTickets] = useState({});


  // Tässä nyt kaikki komponentit samassa, kun halusin eka saada tämän toimimaan ennen kuin lähden
  // eri komponentteja tästä rakentamaan

 // Functio that update the selectedTickets 
 const handleTicketChange = (eventId, ticketTypeId, value) => {
  setSelectedTickets((prev) => ({
    ...prev,
    [eventId]: {
      ...(prev[eventId] || {}),
      [ticketTypeId]: value,
    },
  }));
};

// Calculating the total price of all the chosen tickets
  // Ei nyt toimi, näyttää nollaa lippujen hinnoiksi, joku logiikka virhe tässä ajattelussa siis on
  const calculateTotalPrice = () => {
    let totalPrice = 0;
    Object.keys(selectedTickets).forEach((eventId) => {
      const event = events.find((event) => event.id === parseInt(eventId));
      if (event && event.ticketTypes) {
        const eventTotalPrice = event.ticketTypes.reduce((acc, ticketType) => {
          const quantity = selectedTickets[eventId]?.[ticketType.id] || 0;
          const price = ticketType.price || 0;
  
          return acc + quantity * price; 
        }, 0);
        totalPrice += eventTotalPrice || 0;
      }
    });
  console.log(totalPrice)
    return totalPrice;
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
      
      <h2>Events</h2>
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
                    <p className='select-text'>tickets</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div>
        <h2>Order Summary:</h2>
        <p>Total Price: {calculateTotalPrice()} €</p>
        <button className="button" onClick={handlePurchase}>Buy tickets</button>
      </div>
    </div>
  );
}