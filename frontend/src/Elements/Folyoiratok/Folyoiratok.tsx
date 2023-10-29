import React, { useState, useMemo } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { GridRowsProp } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { Folyoirat } from '../../Models/Folyoirat';
import { v4 as uuidv4 } from 'uuid';
import './Folyoiratok.css';
import { useEffect } from "react";
import FolyoiratService from "../../Services/folyoiratService";
import { Dialog, DialogContent, DialogActions, TextField, Select, Button, MenuItem, DialogTitle, DialogContentText, Alert, Stack } from "@mui/material";
import { ReactSession } from "react-client-session";

const folyoiratService = new FolyoiratService();

const Folyoiratok = () => {
    const [folyoiratok, setFolyoiratok] = useState<Folyoirat[]>([]);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [selectedFolyoirat, setSelectedFolyoirat] = useState<Folyoirat>();
    const [addData, setAddData] = useState<Folyoirat>({ id: '', nev: '', szerkeszto: '', nyelv: '', minosites: 0, kiado: '' });
    let startIndex = 0;

    const user = ReactSession.get('user');
    const isLoggedIn = ReactSession.get('isLoggedIn');

    const columns: GridColDef[] = [
        {
            field: 'action', 
            headerName: 'Action',
            width: 200, 
            editable: false,
            renderCell: (params) => {
                return (
                    <div>
                        <button onClick={() => deleteFolyoirat(params.row)!}>Delete</button>
                        <button onClick={() => handleOpen(params)} >Update </button>
                    </div>
                )
            }
        },
        {field: 'id', headerName: 'ID', width: 200},
        {field: 'nev', headerName: 'Név', width: 200, editable: true},
        {field: 'szerkeszto', headerName: 'Szerkesztő', width: 200, editable: true},
        {field: 'nyelv', headerName: 'Nyelv', width: 200, editable: true},
        {field: 'minosites', headerName: 'Minősítés', width: 200, editable: true},
        {field: 'kiado', headerName: 'Kiadó', width: 200},
    ];

    useEffect(() => {
        folyoiratService.getAllFolyoirat().then(setFolyoiratok);
        if (startIndex == 0 && (!isLoggedIn)) {
            alert('You are not logged in');
            window.location.href = '/login';
            startIndex++;
        }
    }, []);

    const deleteFolyoirat = (row: Folyoirat) => {
        if (!isLoggedIn || user.jogosultsag != "ADMIN") {
            alert('You are not logged in or you are not an admin!');
            return;
        }
        folyoiratService.deleteFolyoirat(row);
        window.location.reload();
    }

    const handleOpen = (params: any) => {
        if (!isLoggedIn || user.jogosultsag != "ADMIN") {
            alert('You are not logged in or you are not an admin!');
            return;
        }
        setSelectedFolyoirat(params.row);
        setUpdateDialogOpen(true);
    };

    const handleAdd = () => {
        folyoiratService.addNewFolyoirat({ ...addData, id: uuidv4(), szerkeszto: user.felhasznalonev });
        setAddDialogOpen(false);
        window.location.reload();
    };

    const handleAddDialogOpen = () => {
        if (!isLoggedIn || user.jogosultsag != "ADMIN") {
            alert('You are not logged in or you are not an admin!');
            return;
        }
        setAddDialogOpen(true);
    };

    const handleSave = () => {
        folyoiratService.saveFolyoirat(selectedFolyoirat!);
        setUpdateDialogOpen(false);
        window.location.reload();
    };

    
    return <div id="folyoiratokMain">
        <div id='ButtonsGroup'>
            <button onClick={() => handleAddDialogOpen()}>Add new</button>
        </div>
        <div>
            <DataGrid rows={folyoiratok} columns={columns} editMode='row'/>
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
                    id="szerkeszto"
                    label="Szerkesztő"
                    type="text"
                    value={addData?.szerkeszto}
                    fullWidth
                    variant="standard"
                    onChange={(event) => {
                        setAddData({ ...addData, szerkeszto: event.target.value });
                    }}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="nyelv"
                    label="Nyelv"
                    value={addData?.nyelv}
                    type="text"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    variant="standard"
                    onChange={(event) => {
                        setAddData({ ...addData, nyelv: event.target.value });
                    }}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="minosites"
                    label="Minősítés"
                    value={addData?.minosites}
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    variant="standard"
                    onChange={(event) => {
                        setAddData({ ...addData, minosites: parseInt(event.target.value) | 0 });
                    }}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="kiado"
                    label="Kiadó"
                    value={addData?.kiado}
                    type="text"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    variant="standard"
                    onChange={(event) => {
                        setAddData({ ...addData, kiado: event.target.value });
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
                    value={selectedFolyoirat?.nev}
                    fullWidth
                    variant="standard"
                    onChange={(event) => {
                        setSelectedFolyoirat({ ...selectedFolyoirat, nev: event.target.value! } as Folyoirat);
                    }}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="szerkeszto"
                    label="Szerkesztő"
                    type="text"
                    value={selectedFolyoirat?.szerkeszto}
                    fullWidth
                    variant="standard"
                    onChange={(event) => {
                        setSelectedFolyoirat({ ...selectedFolyoirat, szerkeszto: event.target.value! } as Folyoirat);
                    }}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="nyelv"
                    label="Nyelv"
                    value={selectedFolyoirat?.nyelv}
                    type="text"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    variant="standard"
                    onChange={(event) => {
                        setSelectedFolyoirat({ ...selectedFolyoirat, nyelv: event.target.value! } as Folyoirat);
                    }}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="minosites"
                    label="Minősítés"
                    value={selectedFolyoirat?.minosites}
                    type="number"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    variant="standard"
                    onChange={(event) => {
                        setSelectedFolyoirat({ ...selectedFolyoirat, minosites: parseInt(event.target.value!) } as Folyoirat);
                    }}
                />
                <TextField
                    autoFocus
                    margin="dense"
                    id="kiado"
                    label="Kiadó"
                    value={selectedFolyoirat?.kiado}
                    type="text"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    variant="standard"
                    onChange={(event) => {
                        setSelectedFolyoirat({ ...selectedFolyoirat, kiado: event.target.value! } as Folyoirat);
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => handleSave()}>Save</Button>
            </DialogActions>
        </Dialog>
    </div>;
};

export default Folyoiratok;