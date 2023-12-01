import React, { useState, useEffect, useContext } from 'react';
import FetchData from './FetchData';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Collapse,
    IconButton,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';

import { TokenContext } from '../App';



export default function ControlPanel() {
    const { token } = useContext(TokenContext);
    const [events, setEvents] = useState([]);
    const [eventTicketTypes, setEventTicketTypes] = useState({});
    const [selectedEvent, setSelectedEvent] = useState(null);


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
    // Handle collabse function
    const handleToggleCollapse = (event) => {
        setSelectedEvent((prevSelectedEvent) =>
            prevSelectedEvent === event ? null : event
        );
    };

    return (
        <div>
            <h2>Control Panel</h2>
            <FetchData url="https://ticketguru-ticketmaster.rahtiapp.fi/api/events" setData={setEvents} token={token} />
            <FetchData url="https://ticketguru-ticketmaster.rahtiapp.fi/api/tickettypes" setEventTicketTypes={setEventTicketTypes} token={token} />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow style={{ background: '#509bb7' }}>
                            <TableCell></TableCell>
                            <TableCell>Event</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Past events</TableCell>
                            <TableCell>Tickets sold</TableCell>
                            <TableCell>Tickets left</TableCell>
                            <TableCell>Print left tickets</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {events.map((event) => {

                            const eventDate = new Date(event.eventDate);
                            const currentDate = new Date();
                            const isPastEvent = eventDate < currentDate;

                            return (
                                <React.Fragment key={event.id}>
                                    <TableRow style={{ background: isPastEvent ? '#f2f2f2' : 'inherit' }}>
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
                                        <TableCell>{event.name}</TableCell>
                                        <TableCell>{eventDate.toLocaleDateString()}</TableCell>
                                        <TableCell>
                                            {isPastEvent
                                                ? 'Past Event'
                                                : ''}
                                        </TableCell>
                                        <TableCell>XXX</TableCell>
                                        <TableCell>{event.ticketAmount}</TableCell>
                                        <TableCell><Button disabled={isPastEvent} onClick={handlePrintButtonClick}>Print</Button></TableCell>
                                    </TableRow>
                                    <TableRow style={{ background: '#F7FAFC' }}>
                                        <TableCell colSpan={7} style={{ paddingBottom: 0, paddingTop: 0 }}>
                                            <Collapse
                                                in={selectedEvent === event}
                                                timeout="auto"
                                                unmountOnExit
                                            >
                                                <Table>
                                                    <TableHead>
                                                        <TableRow>
                                                            <TableCell>TicketType</TableCell>
                                                            <TableCell>Price</TableCell>
                                                            <TableCell>Selling date</TableCell>
                                                            <TableCell>Amount</TableCell>
                                                            <TableCell>Ticket Checked</TableCell>
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell>TicketType</TableCell>
                                                            <TableCell>Price</TableCell>
                                                            <TableCell>Date</TableCell>
                                                            <TableCell>Amount</TableCell>
                                                            <TableCell>Ticket Checked</TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}