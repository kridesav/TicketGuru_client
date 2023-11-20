import React, { useState } from 'react';


// This component handles the buying process

const FetchPost = ({ url, data, token, onSuccess, onError, noTicketsSelected  }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handlePost = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const responseData = await response.json();
                onSuccess(responseData);
            } else {
                onError();
            }
        } catch (error) {
            console.error('Error during POST request', error);
            onError();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <button onClick={handlePost} disabled={isLoading || noTicketsSelected}>
                {isLoading ? 'Loading...' : 'Buy Tickets'}
            </button>
        </div>
    );
};

export default FetchPost;
