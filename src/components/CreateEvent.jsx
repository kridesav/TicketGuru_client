import React, { useState, useContext } from 'react';
import { TokenContext } from "../App";
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function CreateEvent() {
    const { token } = useContext(TokenContext);
    const [eventId, setEventId] = useState(null);
    const [open, setOpen] = useState(false);
    const [event, setEvent] = React.useState({
        name: "",
        place: "",
        city: "",
        ticketAmount: "",
        eventDate: "",
    });
    const [ticketType, setTicketType] = useState({
        description: "",
        price: "",
    });

    const handleChange = (e) => {
        setEvent({ ...event, [e.target.name]: e.target.value });
        setTicketType({ ...ticketType, [e.target.name]: e.target.value });
    };

    const handleDialogClose = (addAnother) => {
        setOpen(false);
        if (addAnother) {
            setTicketType({ description: "", price: "" });
        } else {
            setEventId(null);
            setTicketType({ description: "", price: "" });
            setEvent({
                name: "",
                place: "",
                city: "",
                ticketAmount: "",
                eventDate: "",
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("https://ticketguru-ticketmaster.rahtiapp.fi/api/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(event),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setEventId(data.id);
            });
    };

    const handleTicketTypeSubmit = (e) => {
        e.preventDefault();
        fetch(`https://ticketguru-ticketmaster.rahtiapp.fi/api/events/${eventId}/tickettypes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(ticketType),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setOpen(true);
            });
    }


    return (
        <div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                <TextField
                    label="Name"
                    name="name"
                    value={event.name}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    label="Place"
                    name="place"
                    value={event.place}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    label="City"
                    name="city"
                    value={event.city}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    label="Ticket Amount"
                    name="ticketAmount"
                    type="number"
                    value={event.ticketAmount}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    label="Event Date"
                    name="eventDate"
                    type="date"
                    value={event.eventDate}
                    onChange={handleChange}
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button type="submit" variant="contained" color="primary">
                    Create Event
                </Button>
            </form>

            {eventId && (
                <form onSubmit={handleTicketTypeSubmit} style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
                    <TextField
                    label="Description"
                    name="description"
                    value={ticketType.description}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    label="Price"
                    name="price"
                    type="number"
                    value={ticketType.price}
                    onChange={handleChange}
                    margin="normal"
                />
                    <Button type="submit" variant="contained" color="primary">
                        Add Ticket Type
                    </Button>
                </form>
            )}

            <Dialog
                open={open}
                onClose={() => handleDialogClose(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Add another ticket type?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Do you want to add another ticket type to this event?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleDialogClose(false)} color="primary">
                        No
                    </Button>
                    <Button onClick={() => handleDialogClose(true)} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CreateEvent;