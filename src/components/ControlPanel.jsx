import React, { useState, useEffect, useContext } from 'react';
import FetchData from './FetchData';
import TicketWindow from './PurchasedTickets';
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
    Select,
    MenuItem,
    DialogActions,
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
    const [ticketType, setTicketType] = useState('');
    const [openPrint, setOpenPrint] = useState(false);
    const [event, setEvent] = useState('');
    const [ticketData, setTicketData] = useState(null);

    // ***** Mitä vielä pitää tehdä:*****
    // - Myymättömien lippujen näkymä ja mahdollisuus tulostaa ne

    // Alert for printing unsold tickets. Now not printing them

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
            {ticketData && <TicketWindow tickets={ticketData} />}
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

                            // Dialog for selecting ticket type to print
                            const handleOpenPrint = () => {
                                if (event.ticketTypes.length > 0) {
                                    setTicketType(event.ticketTypes[0].id); // Set the first ticket type as the default option
                                } else { setTicketType(''); } // If there are no ticket types, set the default option to empty string
                                setOpenPrint(event.id); // Open the print dialog for this event
                            };

                            const handleClosePrint = () => {
                                setOpenPrint(false); // Close the print dialog
                            };

                            const fetchEventData = () => {
                                fetch('https://ticketguru-ticketmaster.rahtiapp.fi/api/events', {
                                  headers: {
                                    'Authorization': `Bearer ${token}`,
                                  },
                                })
                                  .then((response) => {
                                    if (!response.ok) {
                                      throw new Error('Network response was not ok');
                                    }
                                    return response.json();
                                  })
                                  .then((data) => {
                                    setEvents(data); // Update the events state with the new data
                                  })
                                  .catch((error) => {
                                    console.error('There has been a problem with your fetch operation:', error);
                                  });
                              };

                            const handlePrintButtonClick = () => {
                                const generateTicketsDto = {
                                    eventId: event.id,
                                    ticketTypeId: ticketType,
                                };
                                fetch('https://ticketguru-ticketmaster.rahtiapp.fi/api/generatetickets', {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': `Bearer ${token}`,
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(generateTicketsDto),
                                })
                                    .then((response) => {
                                        if (!response.ok) {
                                            throw new Error('Network response was not ok');
                                        }
                                        return response.json();
                                    })
                                    .then((data) => {
                                        setTicketData(data);
                                        handleClosePrint(); // Close the dialog after clicking the print button
                                        fetchEventData(); // Update the events state with the new data
                                    })
                                    .catch((error) => {
                                        console.error('There has been a problem with your fetch operation:', error);
                                    });
                            };

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
                                        <TableCell><Button
                                            disabled={isPastEvent || event.ticketAmount === 0}
                                            onClick={handleOpenPrint}
                                        >
                                            Print
                                        </Button></TableCell>
                                    </TableRow>
                                    {openPrint === event.id && (
                                        <Dialog open={openPrint === event.id} onClose={handleClosePrint}>
                                            <DialogTitle>Generate Tickets</DialogTitle>
                                            <DialogContent>
                                                <Select
                                                    value={ticketType}
                                                    onChange={(e) => setTicketType(e.target.value)}
                                                >
                                                    {event.ticketTypes.map((ticketType) => (
                                                        <MenuItem key={ticketType.id} value={ticketType.id}>
                                                            {ticketType.description}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={handleClosePrint}>Cancel</Button>
                                                <Button onClick={handlePrintButtonClick}>Generate</Button>
                                            </DialogActions>
                                        </Dialog>
                                    )}
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