import { useEffect } from 'react';

export default function FetchData({ url, setData, token, setEventTicketTypes }) {
  useEffect(() => {
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      if (setEventTicketTypes) {
        const ticketTypesByEvent = data.reduce((acc, ticketType) => {
          const eventId = ticketType.event.id;
          if (!acc[eventId]) {
            acc[eventId] = [];
          }
          acc[eventId].push(ticketType);
          return acc;
        }, {});
        setEventTicketTypes(ticketTypesByEvent);
      } else {
        setData(data);
      }
    })
    .catch(error => console.error('Error:', error));
  }, [url, setData, token, setEventTicketTypes]);

  return null;
}