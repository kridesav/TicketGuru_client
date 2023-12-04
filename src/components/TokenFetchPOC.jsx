import { useState, useEffect, createContext } from "react";
import { ThemeProvider, Container, CssBaseline, Box, Avatar, createTheme, Typography, TextField, Button, Grid, Link, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar } from '@mui/material';
import { jwtDecode } from "jwt-decode";
export const TokenContext = createContext();

export default function TokenFetchPOC({ children }) {
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState('');
    const [registerDialogOpen, setRegisterDialogOpen] = useState(false);
    const [registerError, setRegisterError] = useState('');
    const [registerSuccess, setRegisterSuccess] = useState('');

    const defaultTheme = createTheme();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setLoading(true);
        setUsername(data.get('username'));
        setPassword(data.get('password'));
        setIsLoggedIn(true);
    };

    const handleRegisterSubmit = (event) => {
        event.preventDefault();
        if (registerPassword !== confirmPassword) {
            setPasswordError(true);
        } else {
            setPasswordError(false);

            fetch('https://ticketguru-ticketmaster.rahtiapp.fi/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: registerUsername,
                    password: registerPassword,
                }),
            })
                .then(response => response.text())
                .then(data => {
                    if (data === "User registered successfully") {
                        setRegisterSuccess(data);
                        setRegisterDialogOpen(false);
                    }
                    else {
                        setRegisterError(data);
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    setRegisterError(error.message);
                });
        }
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
                const decodedToken = jwtDecode(data.token);
                setRole(decodedToken.roles.toLowerCase());
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
                                    <Link href="#" variant="body2" onClick={() => setRegisterDialogOpen(true)}>
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
                <Dialog open={registerDialogOpen} onClose={() => setRegisterDialogOpen(false)}>
                    <DialogTitle>Register</DialogTitle>
                    <form onSubmit={handleRegisterSubmit}>
                        <DialogContent>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="register-username"
                                label="Username"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                value={registerUsername}
                                onChange={(e) => setRegisterUsername(e.target.value)}
                                error={!!registerError}
                                helperText={registerError}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="register-password"
                                autoComplete="current-password"
                                value={registerPassword}
                                onChange={(e) => setRegisterPassword(e.target.value)}
                                error={passwordError}
                                helperText={passwordError ? "Passwords do not match!" : ""}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm Password"
                                type="password"
                                id="register-confirm-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                error={passwordError}
                                helperText={passwordError ? "Passwords do not match!" : ""}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setRegisterDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained">
                                Register
                            </Button>
                        </DialogActions>
                    </form>
                </Dialog>
                <Snackbar
                    open={!!registerSuccess}
                    autoHideDuration={6000}
                    onClose={() => setRegisterSuccess('')}
                    message={registerSuccess}
                />
            </ThemeProvider>
        );
    }

    return (
        <TokenContext.Provider value={{ token, role, logout }}>
            {children}
        </TokenContext.Provider>
    );
}