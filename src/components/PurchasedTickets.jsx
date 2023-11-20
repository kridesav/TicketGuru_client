import React, { useState } from 'react';

const TicketWindow = ({ tickets }) => {
  const [showQR, setShowQR] = useState({});

  const handleClick = (id) => {
    setShowQR((prevShowQR) => ({ ...prevShowQR, [id]: !prevShowQR[id] }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Your Tickets</h1>
      {tickets.map((ticketData) => (
        <div key={ticketData.id} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', width: '80%' }}>
          <div>
            <h2>{ticketData.event.name}</h2>
            <p>Ticket: {ticketData.ticketType.description}</p>
            <p>Code: {ticketData.code}</p>
          </div>
          
          {showQR[ticketData.id] && (
            <div>
              <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketData.code}`} alt={ticketData.event.name} style={{marginTop: '20px'}}/>
            </div>
            )}
          <button onClick={() => handleClick(ticketData.id)}>Show QR</button>
        </div>
      ))}
    </div>
  );
};

export default TicketWindow;