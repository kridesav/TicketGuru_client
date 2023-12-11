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
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    createTheme,
    ThemeProvider,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';

import { TokenContext } from '../App';



export default function ControlPanel() {
    const { token } = useContext(TokenContext);
    const [events, setEvents] = useState([]);
    const [eventTicketTypes, setEventTicketTypes] = useState({});
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    // ***** Mitä vielä pitää tehdä:*****
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

    const theme = createTheme({
        components: {
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        boxShadow: '0px 2px 30px -5px rgba(0, 0, 0, 0.3)', // Shadow for dialog
                    },
                },
            },
            MuiBackdrop: {
                styleOverrides: {
                    root: {
                        backgroundColor: 'transparent', // Make backdrop transparent
                    },
                },
            },
        },
    });

    // Handle collabse function
    const handleToggleCollapse = (event) => {
        if (selectedEvent === event) {
            setSelectedEvent(null); // if the selected event is already open, close it
        } else {
            setSelectedEvent(event); // open the selected event
            setLoading(true);
            fetch(`https://ticketguru-ticketmaster.rahtiapp.fi/api/events/${event.id}/tickets`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    setTickets(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
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
                        <TableRow style={{ background: '#509bb7' }}>
                            <TableCell></TableCell>
                            <TableCell>Event</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Past events</TableCell>
                            <TableCell>Tickets sold</TableCell>
                            <TableCell>Tickets left</TableCell>
                            <TableCell>Print unsold tickets</TableCell>
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
                                                sx={{ '&:focus': { outline: 'none' } }}
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
                                        <TableCell>{event.ticketsSold}</TableCell>
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
                                                {loading ? (
                                                    <CircularProgress />
                                                ) : (
                                                    <Table>
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Description</TableCell>
                                                                <TableCell>Price</TableCell>
                                                                <TableCell>Date bought</TableCell>
                                                                <TableCell>Price</TableCell>
                                                                <TableCell>Checked</TableCell>
                                                                <TableCell>Show code</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {tickets.map((ticket) => (
                                                                <TableRow key={ticket.id}>
                                                                    <TableCell>{ticket.ticketType.description}</TableCell>
                                                                    <TableCell>{ticket.ticketType.price}</TableCell>
                                                                    <TableCell>{new Date(ticket.transaction.date).toLocaleDateString()}</TableCell>
                                                                    <TableCell>{ticket.transaction.amount}</TableCell>
                                                                    <TableCell>{ticket.verified ? 'Yes' : 'No'}</TableCell>
                                                                    <TableCell>
                                                                        <Button onClick={() => {
                                                                            setSelectedTicket(ticket.id);
                                                                            setOpen(true);
                                                                        }}
                                                                        sx={{ '&:focus': { outline: 'none' } }}
                                                                        >
                                                                            Show Code
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                )}
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                    <ThemeProvider theme={theme}>
                                        <Dialog open={open} onClose={() => setOpen(false)}>
                                            <DialogTitle>Ticket Code</DialogTitle>
                                            <DialogContent>
                                                {tickets.find(ticket => ticket.id === selectedTicket)?.code}
                                            </DialogContent>
                                        </Dialog>
                                    </ThemeProvider>
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}