import React, { useState } from 'react';

const TicketWindow = ({ tickets }) => {
  const [showQR, setShowQR] = useState({});

  const handleClick = (id) => {
    setShowQR((prevShowQR) => ({ ...prevShowQR, [id]: !prevShowQR[id] }));
  };

  const handlePrint = (ticketData) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`<html><head><title>Print</title></head><body>
      <h1>${ticketData.event.name}</h1>
      <p>Date: ${ticketData.event.eventDate}</p>
      <p>Ticket: ${ticketData.ticketType.description}</p>
      <p>Price: ${ticketData.ticketType.price}€</p>
      <p>Code: ${ticketData.code}</p>
      <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketData.code}" alt="${ticketData.event.name}" />
    </body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  const handlePrintAll = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Print All</title></head><body>');
    tickets.forEach(ticketData => {
      printWindow.document.write(`
        <h1>${ticketData.event.name}</h1>
        <p>Date: ${ticketData.event.eventDate}</p>
        <p>Ticket: ${ticketData.ticketType.description}</p>
        <p>Price: ${ticketData.ticketType.price}€</p>
        <p>Code: ${ticketData.code}</p>
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketData.code}" alt="${ticketData.event.name}" />
        <hr /> <!-- Add a horizontal line between tickets -->
      `);
    });
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Sold Tickets</h1>
      <button onClick={handlePrintAll}>Print All Tickets</button>
      {tickets.map((ticketData) => (
        <div key={ticketData.id} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px', width: '60%' }}>
          <div>
            <h2>{ticketData.event.name}</h2>
            <p>Ticket: {ticketData.ticketType.description}</p>
            <p>Code: {ticketData.code}</p>
          </div>
          <button onClick={() => handlePrint(ticketData)}>Print Ticket</button>
        </div>
      ))}
    </div>
  );
};

export default TicketWindow;