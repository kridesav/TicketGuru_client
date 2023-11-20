import { useState, useEffect, createContext } from "react";

export const TokenContext = createContext();

export default function TokenFetchPOC({ children }) {
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);
    const username = "user";
    const password = "user";

    useEffect(() => {
        fetchToken();
    }, []);

    const fetchToken = () => {
        fetch('https://ticketguru-ticketmaster.rahtiapp.fi/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: password, user: username })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    throw new Error("Error in fetch:" + response.statusText);
                }
            })
            .then(data => {
                setToken(data.token);
                setLoading(false);
            })
            .catch(err => console.error(err))
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <TokenContext.Provider value={token}>
            {children}
        </TokenContext.Provider>
    );
}