// OrderSummary.js
import React from 'react';


// Calculating the total price of all the chosen tickets
const OrderSummary = ({ selectedTickets, eventTicketTypes }) => {
  const calculateTotalPrice = () => {
    let totalPrice = 0;
    Object.keys(selectedTickets).forEach((eventId) => {
      const ticketTypes = eventTicketTypes[eventId];
      if (ticketTypes) {
        const eventTotalPrice = ticketTypes.reduce((acc, ticketType) => {
          const quantity = selectedTickets[eventId]?.[ticketType.id] || 0;
          const price = ticketType.price || 0;
          return acc + quantity * price;
        }, 0);
        totalPrice += eventTotalPrice || 0;
      }
    });
    return totalPrice;
  };

  return (
    <div>
      <h2>Order Summary:</h2>
      <p>Total Price: {calculateTotalPrice()} €</p>
    </div>
  );
};

export default OrderSummary;