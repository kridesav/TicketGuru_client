import React, { useState, useEffect, useContext } from 'react';
import FetchData from './FetchData';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse, IconButton } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';

import { TokenContext } from '../App';
import EditEvent from './EditEvent';


// EDIT EVENT TAB PAGE
export default function EditEventScreen() {
    const { token } = useContext(TokenContext);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [eventTicketTypes, setEventTicketTypes] = useState({});
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [shouldFetchData, setShouldFetchData] = useState(false);

    // Handle collabse function
    const handleToggleCollapse = (event) => {
        setSelectedEvent((prevSelectedEvent) =>
            prevSelectedEvent === event ? null : event
        );
    };

    // Edit event main info
    const handleEditEvent = (event) => {
        setSelectedEvent(event);
        setEditModalOpen(true);
    };

    const updateData = () => {
        setShouldFetchData(true);
    };

    useEffect(() => {
        if (shouldFetchData) {
            const urls = [
                "https://ticketguru-ticketmaster.rahtiapp.fi/api/events",
                "https://ticketguru-ticketmaster.rahtiapp.fi/api/tickettypes"
            ];

            urls.forEach(url => {
                fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        if (url.endsWith('tickettypes')) {
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
                            setEvents(data);
                        }
                    })
                    .catch(error => console.error('Error:', error));
            });

            setShouldFetchData(false);
        }
    }, [shouldFetchData, setEvents, setEventTicketTypes, token]);

    // Mitä vielä pitää tehdä:
    // - Lisätä muutosmahdollisuus lipputyypeille (tapahtuman muutokseen ei ole lipputyyppejä vielä viety)


    return (
        <div>
            <h2>Edit existing events</h2>
            <p>You can edit any event information and see all tickettypes for events. Press the arrow next to the event to see event's tickettypes</p>

            {/*Fetching data from event and tickettypes */}
            <FetchData url="https://ticketguru-ticketmaster.rahtiapp.fi/api/events" setData={setEvents} token={token} />
            <FetchData url="https://ticketguru-ticketmaster.rahtiapp.fi/api/tickettypes" setEventTicketTypes={setEventTicketTypes} token={token} />

            {/*Event Table information */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow style={{ background: '#509bb7' }}>
                        <TableCell></TableCell>
                            <TableCell>Event</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Place</TableCell>
                            <TableCell>Tickets left</TableCell>
                            <TableCell>Edit event</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {events.map((event) => (
                            <React.Fragment key={event.id}>

                                {/* Rows showing Events */}
                                <TableRow>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => handleToggleCollapse(event)}
                                        >
                                            <KeyboardArrowDownIcon
                                                style={{
                                                    transform: `rotate(${selectedEvent === event ? '180deg' : '0deg'
                                                        })`,
                                                }}
                                            />
                                        </IconButton>
                                       
                                    </TableCell>
                                    <TableCell> {event.name}</TableCell>
                                    <TableCell>
                                        {new Date(event.eventDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{event.place}</TableCell>
                                    <TableCell>{event.ticketAmount}</TableCell>
                                    <TableCell>
                                        {/* Edit Event Icon/button */}
                                        <Button onClick={() => handleEditEvent(event)}>
                                            <EditIcon />
                                        </Button>
                                    </TableCell>
                                </TableRow>

                                {/* Ticket Types Collapse section */}
                                <TableRow style={{ background: '#F7FAFC' }}>
                                    <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                                        <Collapse
                                            in={selectedEvent === event}
                                            timeout="auto"
                                            unmountOnExit
                                        >
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                    <TableCell></TableCell>
                                                        <TableCell>Ticket Types</TableCell>
                                                        <TableCell>Price</TableCell>
                                                        <TableCell></TableCell>
                                                    </TableRow>
                                                </TableHead>

                                                {/* Ticket Types information */}
                                                <TableBody>
                                                    {eventTicketTypes[event.id]?.map((ticketType) => (
                                                        <TableRow key={ticketType.id}>
                                                            <TableCell></TableCell>
                                                            <TableCell>{ticketType.description}</TableCell>
                                                            <TableCell>{ticketType.price} €</TableCell>
                                                            <TableCell></TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Event Modal */}
            {editModalOpen && (
                <EditEvent
                    eventToEdit={selectedEvent}
                    onClose={() => {
                        setEditModalOpen(false);
                        updateData();
                    }}
                    eventTicketTypes={eventTicketTypes[selectedEvent.id]}
                />
            )}
        </div>
    );
}