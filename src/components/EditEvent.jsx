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

function EditEvent({ eventToEdit, onClose }) {
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

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };


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
        .catch(() =>{
            onClose(false);
        })
};

  return (
    <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle id="form-dialog-title">Edit Event</DialogTitle>
      <DialogContent>
        <DialogContentText>
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
                <Button type="submit" variant="contained" color="primary">
                  Save Changes
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
