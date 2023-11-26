import React, { useState, useEffect, useContext } from 'react';
import FetchData from './FetchData';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { TokenContext } from '../App';
import EditEvent from './EditEvent';


// EDIT EVENT TAB

export default function ControlPanel() {
    const { token } = useContext(TokenContext);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [eventTicketTypes, setEventTicketTypes] = useState({});
    const [editModalOpen, setEditModalOpen] = useState(false);


    const handleEditEvent = (event) => {
        setSelectedEvent(event);
        setEditModalOpen(true);
    };


    // Mitä vielä pitää tehdä:
    // - Päivittää sivu muutosten jälkeen (nyt ei päivity suoraan)
    // - Lisätä muutosmahdollisuus lipputyypeille (tapahtuman muutokseen ei ole lipputyyppejä vielä viety)
    // - Näyttää jokaisen tapahtuman transactionit (tämän voisi lisätä Collapsible table tyylillä)
    // - Myymättömien lippujen näkymä ja mahdollisuus tulostaa ne

    return (
        <div>
            <h2>Edit existing events</h2>
            <FetchData url="https://ticketguru-ticketmaster.rahtiapp.fi/api/events" setData={setEvents} token={token} />
            <FetchData url="https://ticketguru-ticketmaster.rahtiapp.fi/api/tickettypes" setEventTicketTypes={setEventTicketTypes} token={token} />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Event</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Place</TableCell>
                            <TableCell>Tickets left</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {events.map(event => (
                            <TableRow key={event.id}>
                                <TableCell>{event.name}</TableCell>
                                <TableCell>{new Date(event.eventDate).toLocaleDateString()}</TableCell>
                                <TableCell>{event.place}</TableCell>
                                <TableCell>{event.ticketAmount}</TableCell>
                                <TableCell>
                                    <Button
                                        onClick={() => handleEditEvent(event)}
                                    >EDIT</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {editModalOpen && (
                            <EditEvent
                                eventToEdit={selectedEvent}
                                onClose={() => setEditModalOpen(false)}
                                eventTicketTypes={eventTicketTypes[selectedEvent.id]}
                            />
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

        </div>
    );
}