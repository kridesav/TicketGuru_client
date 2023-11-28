import React, { useState, useContext } from 'react';
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import QRScanner from './QRScanner';
import { TokenContext } from '../App';

function CheckTicket() {
    const [code, setCode] = useState('');
    const [ticketInfo, setTicketInfo] = useState(null);
    const [scan, setScan] = useState(false);
    const { token } = useContext(TokenContext);

    const startScan = () => {
        setScan(true);
    };

    const stopScan = (code) => {
        setScan(false);
        getTicketInfo(code);
    };

    const getTicketInfo = async (code) => {
        try {
            const response = await fetch(`https://ticketguru-ticketmaster.rahtiapp.fi/api/tickets/check/${code}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setTicketInfo(data);
        } catch (error) {
            console.error('Error fetching ticket info:', error);
        }
    };

    const checkTicket = async () => {
        try {
            const response = await fetch(`https://ticketguru-ticketmaster.rahtiapp.fi/api/tickets/check/${code}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.httpStatus === "BAD_REQUEST") {
                alert('This ticket has already been checked.');
                return;
            }

            // If the ticket is not checked, update it
            const updateResponse = await fetch(`https://ticketguru-ticketmaster.rahtiapp.fi/api/tickets/markused/${code}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const updateData = await updateResponse.json();
            setTicketInfo(updateData);
            alert('The ticket has been successfully checked.');
        } catch (error) {
            console.error('Error checking ticket:', error);
        }
    };

    const renderValue = (value, key) => {
        if (typeof value === 'object' && value !== null) {
            return Object.entries(value).map(([subKey, subValue]) => {
                if (!subKey.toLowerCase().endsWith('id') && typeof subValue !== 'object') {
                    return <div key={`${key}-${subKey}`}>{`${subKey}: ${subValue}`}</div>;
                }
                return null;
            });
        }
        return value.toString();
    };


    return (
        <div>
            {ticketInfo && ticketInfo.event && (
                <>
                    <h2>{ticketInfo.event.name}</h2>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Place</TableCell>
                                    <TableCell>{ticketInfo.event.place}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>City</TableCell>
                                    <TableCell>{ticketInfo.event.city}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Event Date</TableCell>
                                    <TableCell>{new Date(ticketInfo.event.eventDate).toLocaleDateString('fi-FI')}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Price</TableCell>
                                    <TableCell>{ticketInfo.ticketType.price + "€"}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Checked</TableCell>
                                    <TableCell>{ticketInfo.verified.toString()}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Code</TableCell>
                                    <TableCell>{ticketInfo.code}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}

            <TextField value={code} onChange={e => setCode(e.target.value)} fullWidth margin="normal" />
            <Button size="small" onClick={startScan} variant="contained" color="primary" sx={{ margin: 1 }}>
                Start QR Scanner
            </Button>
            <Button size="small" onClick={() => getTicketInfo(code)} variant="contained" color="primary" sx={{ margin: 1 }}>
                Get Ticket Info
            </Button>
            <Button size="small" onClick={checkTicket} variant="contained" color="primary" sx={{ margin: 1 }}>
                Check Ticket
            </Button>
            {scan && <QRScanner onScan={(ticketcode) => { setCode(ticketcode); stopScan(ticketcode); }} />}
        </div >
    );
}

export default CheckTicket;