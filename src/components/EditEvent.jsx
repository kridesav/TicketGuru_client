import React, { useState, useContext } from 'react';
import {
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Container,
    Grid,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material';
import { TokenContext } from "../App";

// Function that handles editing event
function EditEvent({ eventToEdit, onClose, eventTicketTypes }) {

    const { token } = useContext(TokenContext);
    const [eventId, setEventId] = useState(null);
    const [open, setOpen] = useState(false);
    const [event, setEvent] = React.useState(eventToEdit || {
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


    // Edit existing Event
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`https://ticketguru-ticketmaster.rahtiapp.fi/api/events/${eventToEdit.id}`, {
            method: "PUT",
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
                setOpen(true);
                onClose(true);
            })
            .catch(() => {
                onClose(false);
            })
    };

    // Add new TicketTypes to existing event
    const handleTicketTypeSubmit = (e) => {
        e.preventDefault();

        if (!ticketType.description || !ticketType.price) {
            console.error("Description and price are required.");
            return;
        }
        fetch(`https://ticketguru-ticketmaster.rahtiapp.fi/api/events/${eventToEdit.id}/tickettypes`, {

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
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle id="form-dialog-title">Edit Event</DialogTitle>
            <DialogContent>
                <DialogContentText style={{ marginBottom: 20 }}>
                    Please update the information below.
                </DialogContentText>
                <Container>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Event Name"
                                    name="name"
                                    value={event.name}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Place"
                                    name="place"
                                    value={event.place}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="City"
                                    name="city"
                                    value={event.city}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Ticket Amount"
                                    name="ticketAmount"
                                    type="number"
                                    value={event.ticketAmount}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Event Date"
                                    name="eventDate"
                                    type="date"
                                    value={event.eventDate}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button style={{ marginBottom: 15 }} type="submit" variant="contained" color="primary">
                                    Save Event Changes
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                    <Divider sx={{ borderBottomWidth: '5px' }} />
                    <List>
                        <ListItemText>TicketTypes for this event:</ListItemText>
                        {eventTicketTypes && eventTicketTypes.map((type, index) => (
                            <ListItem key={index}>
                                <ListItemText
                                    primary={`- ${type.description}: ${type.price} €`}
                                />

                            </ListItem>
                        ))}
                    </List>

                    <Divider sx={{ borderBottomWidth: '5px' }} />
                    <ListItemText style={{ marginTop: 20, marginBottom: 25 }}>Add New TicketTypes to this event</ListItemText>
                    <form onSubmit={handleTicketTypeSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Ticket Type Description"
                                    name="description"
                                    value={ticketType.description}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Ticket Type Price"
                                    name="price"
                                    type="number"
                                    value={ticketType.price}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary">
                                    Add new TicketType to event
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Container>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditEvent;
