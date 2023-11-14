import { useState, useEffect } from "react";

export default function TokenFetchPOC() {
    const [token, setToken] = useState('');
    // Korvataan propseilla tai .env muuttujilla
    const username = "user";
    const password = "user";

    useEffect(() => {
        fetchToken();
    }, []);

    const fetchToken = () => {
        fetch('http://ticketguru-ticketmaster.rahtiapp.fi/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({password: password, user: username})
        })
        .then(response => {
            if(response.ok) {
                return response.json();
            }
            else {
                throw new Error("Error in fetch:" + response.statusText);
            }
        })
        .then(data => setToken(data))
        .catch(err => console.error(err))
    };
}