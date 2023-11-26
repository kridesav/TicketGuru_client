import React, { useState, useEffect, useContext } from 'react';
import FetchData from './FetchData';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Box } from '@mui/material';
import CreateEvent from './CreateEvent';
import { TokenContext } from '../App';
import EditEvent from './EditEvent';


export default function ControlPanel() {
    const { token } = useContext(TokenContext);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [eventTicketTypes, setEventTicketTypes] = useState({});
    const [ticketData, setTicketData] = useState(null);
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
            <h2>Control Panel</h2>
            <p>Here you can find all the event information and you can also edit any events.</p>
            <h3>All events</h3>
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
                                onClose={(success) => {
                                    setEditModalOpen(false);
                                    setSelectedEvent(null);
                                  }}
                                />
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}