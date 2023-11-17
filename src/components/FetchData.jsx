import { useEffect } from 'react';

export default function FetchData({ url, setData, token, eventId }) {
  useEffect(() => {
    const fetchUrl = eventId ? `${url}/${eventId}/tickettypes` : url;

    fetch(fetchUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      if (eventId) {
        setData(prevState => ({ ...prevState, [eventId]: data }));
      } else {
        setData(data);
      }
    })
    .catch(error => console.error('Error:', error));
  }, [url, setData, token, eventId]);

  return null;
}