import React, { useState, useMemo } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { GridRowsProp } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { Folyoirat } from '../../Models/Folyoirat';
import { Kiado } from '../../Models/Kiado';
import { v4 as uuidv4 } from 'uuid';
import './Folyoiratok.css';
import { useEffect } from "react";
import FolyoiratService from "../../Services/folyoiratService";
import KiadoService from "../../Services/kiadoService";
import { Dialog, DialogContent, DialogActions, TextField, Select, Button, MenuItem, DialogTitle, DialogContentText, Alert, Stack } from "@mui/material";
import { ReactSession } from "react-client-session";

const folyoiratService = new FolyoiratService();
const kiadoService = new KiadoService();

const Folyoiratok = () => {
    const user = ReactSession.get('user');
    const isLoggedIn = ReactSession.get('isLoggedIn');

    const [folyoiratok, setFolyoiratok] = useState<Folyoirat[]>([]);
    const [kiadok, setKiadok] = useState<Kiado[]>([]);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [selectedFolyoirat, setSelectedFolyoirat] = useState<Folyoirat>();
    const [addData, setAddData] = useState<Folyoirat>({ id: '', nev: '', szerkeszto: user?.felhasznalonev, nyelv: '', minosites: 0, kiado: '' });
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
        kiadoService.getAllKiado().then(setKiadok);
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
                <Select value={addData?.kiado} sx={{width: 200, color: "black"}} onChange={(params) => setAddData({ ...addData, kiado: params.target.value})}>
                    {kiadok.map((kiado) => (
                        <MenuItem 
                            key={kiado.nev}
                            value={kiado.nev}
                        >{kiado.nev}</MenuItem>
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
                <Select value={selectedFolyoirat?.kiado} sx={{width: 200, color: "black"}} onChange={(params) => setAddData({ ...addData, kiado: params.target.value})}>
                    {kiadok.map((kiado) => (
                        <MenuItem 
                            key={kiado.nev}
                            value={kiado.nev}
                        >{kiado.nev}</MenuItem>
                    ))}
                </Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
                <Button onClick={() => handleSave()}>Save</Button>
            </DialogActions>
        </Dialog>
    </div>;
};

export default Folyoiratok;