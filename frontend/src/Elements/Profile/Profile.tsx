import "./Profile.css";
import { ReactSession } from "react-client-session";
import React, { useEffect, useState } from "react";
import UserService from "../../Services/userService";
import { Dialog, DialogContent, DialogActions, TextField, Select, Button, MenuItem, DialogTitle, DialogContentText } from "@mui/material";
import { Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const userService = new UserService();

const Profile = () => {
    const user = ReactSession.get('user');
    const isLoggedIn = ReactSession.get('isLoggedIn');

    const [firstName, setFirstName] = useState(user?.keresztnev);
    const [lastName, setLastName] = useState(user?.vezeteknev);
    const [email, setEmail] = useState(user?.email);
    const [currentPassword, setCurrentPasswrd] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [updatePasswordDialogOpen, setUpdatePasswordDialogOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    let startIndex = 0;

    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref,
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    useEffect(() => {
        if (!isLoggedIn) {
            alert('You are not logged in!');
            window.location.href = '/login';
        } else {
            if (startIndex == 0) {
                setSnackbarOpen(true);
                startIndex++;
            }
        }
    }, []);

    const handleSave = () => {
        userService.saveUser({...user, keresztnev: firstName, vezeteknev: lastName, email: email});
        window.location.reload();
    }

    const handleOpen = (params: any) => {
        setUpdateDialogOpen(true);
    };

    const handlePasswordChangeOpen = (params: any) => {
        setUpdatePasswordDialogOpen(true);
    }

    return (
        <div id="profileMain">
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%', zIndex: 100000 }}>
                    Login successful!
                </Alert>
            </Snackbar>
            <div id="headerButtons">
                <button onClick={() => setUpdateDialogOpen(true)}>Update profile</button>
                <button>Delete profile</button>
            </div>
            <div id="profileInfo">
                <div id="profilePicture">
                    <img src="https://i.imgur.com/YxABR43.jpeg" alt="Profile picture" />
                    <div id="profileText">
                        <h1>Username</h1>
                        <div>
                            <p>First name: </p>
                            <input type="text" disabled value={firstName} />
                        </div>
                        <div>
                            <p>Last name: </p>
                            <input type="text" disabled value={lastName} />
                        </div>
                        <div>
                            <p>Email: </p>  
                            <input type="text" disabled value={email} />
                        </div>
                    </div>
                </div> 
            </div>
            <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="Email"
                        label="E-mail"
                        type="email"
                        value={email}
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setEmail(event.target.value);
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="keresztnev"
                        label="Keresztnév"
                        type="text"
                        value={lastName}
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setLastName(event.target.value);
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="vezeteknev"
                        label="Vezetéknév"
                        value={firstName}
                        type="text"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setFirstName(event.target.value);
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => handleSave()}>Save</Button>
                </DialogActions>
            </Dialog>
            <div id="mainChangePasswordPart">
                <div id="changePasswordButton">
                    <button onClick={() => setUpdatePasswordDialogOpen(true)}>Change password</button>
                </div>
                <Dialog open={updatePasswordDialogOpen} onClose={() => setUpdatePasswordDialogOpen(false)}>
                    <DialogTitle>Subscribe</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="password1"
                            label="Jelszó"
                            type="password"
                            value={password}
                            fullWidth
                            variant="standard"
                            onChange={(event) => {
                                setPassword(event.target.value);
                            }}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="password2"
                            label="Jelszó mégegyszer"
                            type="password"
                            value={password2}
                            fullWidth
                            variant="standard"
                            onChange={(event) => {
                                setPassword2(event.target.value);
                            }}
                        />
                        <TextField
                            autoFocus
                            margin="dense"
                            id="currentPassword"
                            label="Jelenlegi jelszó"
                            value={currentPassword}
                            type="password"
                            fullWidth
                            variant="standard"
                            onChange={(event) => {
                                setCurrentPasswrd(event.target.value);
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setUpdatePasswordDialogOpen(false)}>Cancel</Button>
                        <Button onClick={() => handleSave()}>Save</Button>
                    </DialogActions>
                </Dialog>
            </div>
            
        </div>
        
    )
}

export default Profile;