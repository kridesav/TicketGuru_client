import React, { useState, useEffect, useContext } from 'react';
import FetchData from './FetchData';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { TokenContext } from '../App';



export default function ControlPanel() {
    const { token } = useContext(TokenContext);
    const [events, setEvents] = useState([]);
    const [eventTicketTypes, setEventTicketTypes] = useState({});


    // ***** Mitä vielä pitää tehdä:*****
    // - Näyttää jokaisen tapahtuman transactionit (tämän voisi lisätä Collapsible table tyylillä)
    // - Myymättömien lippujen näkymä ja mahdollisuus tulostaa ne

    // Alert for printing unsold tickets. Now not printing them
    const handlePrintButtonClick = () => {
        const confirmation = window.confirm("Do you want to print all unsold tickets for this event?");
        
        if (confirmation) {
            console.log("Printing unsold tickets...");
        } else {
            console.log("Printing canceled.");
        }
    };

    return (
        <div>
            <h2>Control Panel</h2>
            <FetchData url="https://ticketguru-ticketmaster.rahtiapp.fi/api/events" setData={setEvents} token={token} />
            <FetchData url="https://ticketguru-ticketmaster.rahtiapp.fi/api/tickettypes" setEventTicketTypes={setEventTicketTypes} token={token} />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Event</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Past/Future</TableCell>
                            <TableCell>Tickets sold</TableCell>
                            <TableCell>Tickets left</TableCell>
                            <TableCell>Print left tickets</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {events.map(event => {
                            const eventDate = new Date(event.eventDate);
                            const currentDate = new Date();
                            const isPastEvent = eventDate < currentDate;

                            return (
                                <TableRow key={event.id} style={{ background: isPastEvent ? '#f2f2f2' : 'inherit' }}>
                                    <TableCell>{event.name}</TableCell>
                                    <TableCell>{eventDate.toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        {isPastEvent
                                            ? 'Past Event'
                                            : 'In the Future'}
                                    </TableCell>
                                    <TableCell>XXX</TableCell>
                                    <TableCell>{event.ticketAmount}</TableCell>
                                    <TableCell><Button disabled={isPastEvent} onClick={handlePrintButtonClick}>Print</Button></TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

        </div>
    );
}