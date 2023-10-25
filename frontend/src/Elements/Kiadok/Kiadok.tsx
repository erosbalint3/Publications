import React, { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { GridRowsProp } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { Kiado } from '../../Models/Kiado';
import { v4 as uuidv4 } from 'uuid';
import KiadoService from '../../Services/kiadoService';
import './Kiadok.css';
import { Dialog, DialogContent, DialogActions, TextField, Select, Button, MenuItem, DialogTitle, DialogContentText } from "@mui/material";
import { ReactSession } from "react-client-session";

const kiadoService = new KiadoService();

const Kiadok = () => {
    const [kiadok, setKiadok] = useState<Kiado[]>([]);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [selectedKiado, setSelectedKiado] = useState<Kiado>();
    const [addData, setAddData] = useState<Kiado>({ nev: '', telefonszam: '', szekhely: '' });

    const user = ReactSession.get('user');
    const isLoggedIn = ReactSession.get('isLoggedIn');

    let startIndex = 0;

    const columns: GridColDef[] = [
        {
            field: 'action', 
            headerName: 'Action',
            width: 200, 
            editable: false,
            renderCell: (params) => {
                return (
                    <div>
                        <button onClick={() => deleteKiado(params.row)!}>Delete</button>
                        <button onClick={() => handleOpen(params)} >Update </button>
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
        if (startIndex == 0 && (!isLoggedIn || user.jogosultsag != "ADMIN")) {
            alert('You are not logged in!');
            window.location.href = '/login';
            startIndex++;
        }
    }, []);

    const deleteKiado = (row: Kiado) => {
        kiadoService.deleteKiado(row);
        window.location.reload();
    }

    const handleOpen = (params: any) => {
        setSelectedKiado(params.row);
        setUpdateDialogOpen(true);
    };

    const handleAdd = () => {
        kiadoService.addNewKiado(addData);
        setAddDialogOpen(false);
        window.location.reload();
    };

    const handleSave = () => {
        kiadoService.saveKiado(selectedKiado!);
        setUpdateDialogOpen(false);
        window.location.reload();
    };

    return (
        <div id='kiadokMain'>
            <div id='ButtonsGroup'>
                <button onClick={() => setAddDialogOpen(true)}>Add new</button>
            </div>
            <div>
                <DataGrid rows={kiadok} columns={columns} editMode='row' getRowId={(row) => row.nev}/>
            </div>
            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
                <DialogTitle>Subscribe</DialogTitle>
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
                    <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
                    <Button onClick={() => handleSave()}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
};

export default Kiadok;