import { useState, useEffect, createContext } from "react";
import { ThemeProvider, Container, CssBaseline, Box, Avatar, createTheme, Typography, TextField, Button, Grid, Link } from '@mui/material';

export const TokenContext = createContext();

export default function TokenFetchPOC({ children }) {
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState('');

    const defaultTheme = createTheme();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setLoading(true);
        setUsername(data.get('username'));
        setPassword(data.get('password'));
        setIsLoggedIn(true);
    };

    const logout = () => {
        setToken('');
        setIsLoggedIn(false);
        console.log('Logged out');
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchToken();
        }
    }, [isLoggedIn]);

    const fetchToken = () => {
        fetch('https://ticketguru-ticketmaster.rahtiapp.fi/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ password: password, user: username })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    setIsLoggedIn(false);
                    setLoading(false);
                    alert('Wrong username or password');
                    throw new Error("Error in fetch:" + response.statusText);
                }
            })
            .then(data => {
                setToken(data.token);
                setRole(data.user);
                setLoading(false);
            })
            .catch(err => console.error(err))
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isLoggedIn) {
        return (
            <ThemeProvider theme={defaultTheme}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box
                        sx={{
                            marginTop: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item>
                                    <Link href="#" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </ThemeProvider>
        );
    }

    return (
        <TokenContext.Provider value={{ token, role, logout }}>
            {children}
        </TokenContext.Provider>
    );
}