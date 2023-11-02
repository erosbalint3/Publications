import React, { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { GridRowsProp } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { Kiado } from '../../Models/Kiado';
import { v4 as uuidv4 } from 'uuid';
import KiadoService from '../../Services/kiadoService';
import './Kiadok.css';
import { Dialog, DialogContent, DialogActions, TextField, Select, Button, MenuItem, DialogTitle, DialogContentText, createTheme, ThemeProvider } from "@mui/material";
import { ReactSession } from "react-client-session";
import { Snackbar, ToggleButton, ToggleButtonGroup } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Error } from '../../Models/Error';
import { huHU } from '@mui/material/locale';

const kiadoService = new KiadoService();

const Kiadok = () => {
    const [kiadok, setKiadok] = useState<Kiado[]>([]);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [selectedKiado, setSelectedKiado] = useState<Kiado>();
    const [addData, setAddData] = useState<Kiado>({ nev: '', telefonszam: '', szekhely: '', szerkeszto: '' });
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

    const columns: GridColDef[] = [
        {
            field: 'action', 
            headerName: 'Action',
            width: 200, 
            editable: false,
            renderCell: (params) => {
                return (
                    <div>
                        <button onClick={() => deleteKiado(params.row)!}>Törlés</button>
                        <button onClick={() => handleOpen(params)} >Szerkesztés</button>
                    </div>
                )
            }
        },
        {field: 'nev', headerName: 'Név', width: 200},
        {field: 'telefonszam', headerName: 'Telefonszám', width: 200, editable: true},
        {field: 'szekhely', headerName: 'Székhely', width: 200, editable: true},
    ];

    useEffect(() => {
        kiadoService.getAllKiado().then((response) => {
            setKiadok(response);
        });
        if (startIndex == 0 && !isLoggedIn) {
            alert('You are not logged in!');
            window.location.href = '/login';
            startIndex++;
        }
    }, []);

    const deleteKiado = async (row: Kiado) => {
        if (!isLoggedIn || user.jogosultsag != "ADMIN") {
            alert('You are not logged in or you are not an admin!');
            return;
        }
        const response = await kiadoService.deleteKiado(row);
        if ((response as unknown as Error)?.code == "ER_ROW_IS_REFERENCED_2") {
            setSnackbarError('Cannot delete referenced row!');
            setSnackbarOpen(true);
        } else {
            window.location.reload();
        }
    }

    const handleOpen = (params: any) => {
        if (!isLoggedIn || user.jogosultsag != "ADMIN") {
            alert('You are not logged in or you are not an admin!');
            return;
        }
        setSelectedKiado(params.row);
        setUpdateDialogOpen(true);
    };

    const handleAdd = () => {
        if (!isLoggedIn || user.jogosultsag != "ADMIN") {
            alert('You are not logged in or you are not an admin!');
            return;
        }
        kiadoService.addNewKiado({ ...addData, szerkeszto: user.felhasznalonev });
        setAddDialogOpen(false);
        window.location.reload();
    };

    const handleAddDialogOpen = () => {
        if (!isLoggedIn || user.jogosultsag != "ADMIN") {
            alert('You are not logged in or you are not an admin!');
            return;
        }
        setAddDialogOpen(true);
    }

    const handleSave = () => {
        kiadoService.saveKiado(selectedKiado!);
        setUpdateDialogOpen(false);
        window.location.reload();
    };

    return (
        <div id='kiadokMain'>
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity="error" sx={{ width: '100%' }}>
                    {snackbarError}
                </Alert>
            </Snackbar>
            <div id='ButtonsGroup'>
                <button onClick={() => handleAddDialogOpen()}>Új kiadó</button>
            </div>
            <div>
                <ThemeProvider theme={theme}>
                    <DataGrid rows={kiadok} columns={columns} editMode='row' getRowId={(row) => row.nev}/>
                </ThemeProvider>
            </div>
            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
                <DialogTitle>Új kiadó</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="Nev"
                        label="Név"
                        type="text"
                        required
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
                        id="telefonszam"
                        label="Telefonszám"
                        type="text"
                        value={addData?.telefonszam}
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setAddData({ ...addData, telefonszam: event.target.value });
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="szekhely"
                        label="Székhely"
                        value={addData?.szekhely}
                        type="text"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setAddData({ ...addData, szekhely: event.target.value });
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddDialogOpen(false)}>Mégse</Button>
                    <Button onClick={() => handleAdd()}>Hozzáadás</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
                <DialogTitle>Kiadó szerkesztése</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="nev"
                        label="Név"
                        type="text"
                        value={selectedKiado?.nev}
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setSelectedKiado({ ...selectedKiado, nev: event.target.value! } as Kiado);
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="telefonszam"
                        label="Telefonszám"
                        type="text"
                        value={selectedKiado?.telefonszam}
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setSelectedKiado({ ...selectedKiado, telefonszam: event.target.value! } as Kiado);
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="szekhely"
                        label="Székhely"
                        value={selectedKiado?.szekhely}
                        type="text"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setSelectedKiado({ ...selectedKiado, szekhely: event.target.value! } as Kiado);
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUpdateDialogOpen(false)}>Mégse</Button>
                    <Button onClick={() => handleSave()}>Mentés</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
};

export default Kiadok;