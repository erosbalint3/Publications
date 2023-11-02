import React, { useState, useEffect } from 'react';
import { DataGrid, huHU } from '@mui/x-data-grid';
import { GridRowsProp } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { User } from '../../Models/User';
import UserService from '../../Services/userService';
import './AllProfile.css';
import { Snackbar, ThemeProvider, ToggleButton, ToggleButtonGroup, createTheme } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Error } from '../../Models/Error';

const userService = new UserService();

const AllProfile = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarError, setSnackbarError] = useState('');

    useEffect(() => {
        userService.getAllUser().then(data => setUsers(data as User[])).catch((error) => console.log(error));
    }, []);

    const theme = createTheme({}, huHU);

    const deleteProfile = async (row: User) => {
        const response = await userService.deleteUser(row);
        if ((response as unknown as Error)?.code == "ER_ROW_IS_REFERENCED_2") {
            setSnackbarError('Cannot delete referenced row!');
            setSnackbarOpen(true);
        } else {
            window.location.reload();
        }
    };

    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref,
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const columns: GridColDef[] = [
        {
            field: 'action', 
            headerName: 'Funkciók',
            width: 200, 
            editable: false,
            renderCell: (params) => {
                return (
                    <div>
                        <button onClick={() => deleteProfile(params.row)!}>Törlés</button>
                    </div>
                )
            }
        },
        {field: 'felhasznalonev', headerName: 'Felhasználónév', width: 200, editable: false},
        {field: 'keresztnev', headerName: 'keresztnev', width: 200, editable: false},
        {field: 'vezeteknev', headerName: 'vezeteknev', width: 200, editable: false},
        {field: 'email', headerName: 'Email', width: 200, editable: false},
        {field: 'jogosultsag', headerName: 'Jogosultság', width: 200, editable: false},
    ];

    return (
        <div>
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: '100%' }}>
                    {snackbarError}
                </Alert>
            </Snackbar>
            <div id='mainTable'>
                <ThemeProvider theme={theme}>
                    <DataGrid rows={users} columns={columns} editMode='row' getRowId={(row) => row.felhasznalonev}/>
                </ThemeProvider>
            </div>
        </div>
    );
};

export default AllProfile;