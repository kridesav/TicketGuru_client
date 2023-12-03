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
} from '@mui/material';
import { TokenContext } from "../App";

// Function that handles editing tickettype
export default function EditTicketTypeModal({ ticketTypetoEdit, onClose }) {

    const { token } = useContext(TokenContext);
    const [open, setOpen] = useState(false);
    const [ticketTypeId, setTicketTypeId] = useState(null);
    const [ticketType, setTicketType] = React.useState(ticketTypetoEdit || {
        description: '',
        price: '',
    });


    const handleChange = (e) => {
        setTicketType({ ...ticketType, [e.target.name]: e.target.value });
    };

    // Edit tickettype
    const handleEditTicketType = (e) => {
        e.preventDefault();

        fetch(`https://ticketguru-ticketmaster.rahtiapp.fi/api/tickettypes/${ticketTypetoEdit.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(ticketType),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setTicketTypeId(data.id);
                setOpen(true);
                onClose(true);
            })
            .catch(() => {
                onClose(false);
            })
    };



    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle id="form-dialog-title">Edit Ticket Type</DialogTitle>
            <DialogContent>
                <DialogContentText style={{ marginBottom: 20 }}>
                    Please update the information below.
                </DialogContentText>
                <Container>
                    {/* TicketType Form */}
                    <form onSubmit={handleEditTicketType}>
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
                                <Button style={{ marginBottom: 15 }} type="submit" variant="contained" color="primary">
                                    Save Changes
                                </Button>
                            </Grid>
                        </Grid>
                    </form>

                </Container>
            </DialogContent>

            {/* Cancel button */}
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
}

