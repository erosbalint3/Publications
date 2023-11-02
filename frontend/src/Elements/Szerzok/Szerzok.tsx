import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { GridRowsProp } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { Szerzo } from '../../Models/Szerzo';
import { v4 as uuidv4 } from 'uuid';
import SzerzoService from "../../Services/szerzoService";
import './Szerzok.css';
import { Dialog, DialogContent, DialogActions, TextField, Select, Button, MenuItem, DialogTitle, DialogContentText } from "@mui/material";
import { ReactSession } from "react-client-session";
import { Snackbar, ToggleButton, ToggleButtonGroup, createTheme, ThemeProvider } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Error } from '../../Models/Error';
import { huHU } from '@mui/material/locale';

const szerzoService = new SzerzoService();

const Szerzok = () => {
    const [szerzok, setSzerzok] = useState<Szerzo[]>([]);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [selectedSzerzo, setSelectedSzerzo] = useState<Szerzo>();
    const [addData, setAddData] = useState<Szerzo>({id: '', nev: '', nemzetiseg: '', email: '', affiliacio: ''});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarError, setSnackbarError] = useState('');

    const user = ReactSession.get('user');
    const isLoggedIn = ReactSession.get('isLoggedIn');

    let startIndex = 0;

    const theme = createTheme({}, huHU);

    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref,
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const deleteSzerzo = async (row: Szerzo) => {
        const response = await szerzoService.deleteSzerzo(row);
        if ((response as unknown as Error)?.code == "ER_ROW_IS_REFERENCED_2") {
            setSnackbarError('Cannot delete referenced row!');
            setSnackbarOpen(true);
        } else {
            window.location.reload();
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'action', 
            headerName: 'Action',
            width: 200, 
            editable: false,
            renderCell: (params) => {
                return (
                    <div>
                        <button onClick={() => deleteSzerzo(params.row)!}>Delete</button>
                        <button onClick={() => handleOpen(params)} >Update </button>
                    </div>
                )
            }
        },
        {field: 'id', headerName: 'ID', width: 200, editable: true},
        {field: 'nev', headerName: 'Név', width: 200, editable: true},
        {field: 'nemzetiseg', headerName: 'Nemzetiség', width: 200, editable: true},
        {field: 'email', headerName: 'Email', width: 200, editable: true},
        {field: 'affiliacio', headerName: 'Affiliáció', width: 200, editable: true},
    ];

    useEffect(() => {
        szerzoService.getAllSzerzo().then(data => setSzerzok(data));
        if (startIndex == 0 && !isLoggedIn) {
            alert('You are not logged in');
            window.location.href = '/login';
            startIndex++;
        }
    }, []);

    const handleOpen = (params: any) => {
        setSelectedSzerzo(params.row);
        setUpdateDialogOpen(true);
    };

    const handleAdd = () => {
        szerzoService.addNewSzerzo({...addData, id: uuidv4()});
        setAddDialogOpen(false);
        window.location.reload();
    };

    const handleSave = () => {
        szerzoService.saveSzerzo(selectedSzerzo!);
        setUpdateDialogOpen(false);
        window.location.reload();
    };

    return (
        <div id='szerzokMain'>
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: '100%' }}>
                    {snackbarError}
                </Alert>
            </Snackbar>
            <div id='ButtonsGroup'>
                <button onClick={() => setAddDialogOpen(true)}>Add new</button>
            </div>
            <div>
                <ThemeProvider theme={theme}>
                    <DataGrid rows={szerzok} columns={columns} editMode='row' getRowId={(row) => row.nev}/>
                </ThemeProvider>
            </div>
            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="Email"
                        label="E-mail"
                        type="email"
                        value={addData?.email}
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setAddData({ ...addData, email: event.target.value });
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="nev"
                        label="Név"
                        type="text"
                        value={addData?.nev}
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setAddData({ ...addData, nev: event.target.value });
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="nemzetiseg"
                        label="Nemzetiség"
                        value={addData?.nemzetiseg}
                        type="text"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setAddData({ ...addData, nemzetiseg: event.target.value });
                        }}
                    />
                    <Select value={addData.affiliacio} sx={{width: 200, color: "black"}} onChange={(params) => setAddData({ ...addData, affiliacio: params.target.value})}>
                            {Array.from({length: 10}, (_, i) => i + 1).map((num) => (
                                <MenuItem 
                                    key={num}
                                    value={num}
                                >{num}</MenuItem>
                            ))}
                        </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => handleAdd()}>Add</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="email"
                        label="E-mail"
                        type="email"
                        value={selectedSzerzo?.email}
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setSelectedSzerzo({ ...selectedSzerzo, email: event.target.value! } as Szerzo);
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="nev"
                        label="Név"
                        type="text"
                        value={selectedSzerzo?.nev}
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setSelectedSzerzo({ ...selectedSzerzo, nev: event.target.value! } as Szerzo);
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="nemzetiseg"
                        label="Nemzetiség"
                        value={selectedSzerzo?.nemzetiseg}
                        type="text"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setSelectedSzerzo({ ...selectedSzerzo, nemzetiseg: event.target.value! } as Szerzo);
                        }}
                    />
                    <Select value={selectedSzerzo?.affiliacio} sx={{width: 200, color: "black"}} onChange={(event) => {
                        setSelectedSzerzo({ ...selectedSzerzo, affiliacio: event.target.value } as Szerzo);
                    }}>
                            {Array.from({length: 10}, (_, i) => i + 1).map((num) => (
                                <MenuItem 
                                    key={num}
                                    value={num}
                                >{num}</MenuItem>
                            ))}
                        </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => handleSave()}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
};

export default Szerzok;