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

const szerzoService = new SzerzoService();

const deleteSzerzo = (row: Szerzo) => {
    szerzoService.deleteSzerzo(row);
    window.location.reload();
};

const Szerzok = () => {
    const [szerzok, setSzerzok] = useState<Szerzo[]>([]);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [selectedSzerzo, setSelectedSzerzo] = useState<Szerzo>();
    const [addData, setAddData] = useState<Szerzo>({id: '', nev: '', nemzetiseg: '', email: '', affiliacio: ''});

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
        if (startIndex == 0 && (!isLoggedIn || user.jogosultsag != "ADMIN")) {
            alert('You are not logged in or you are not an admin!');
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
            <div id='ButtonsGroup'>
                <button onClick={() => setAddDialogOpen(true)}>Add new</button>
            </div>
            <div>
                <DataGrid rows={szerzok} columns={columns} editMode='row' getRowId={(row) => row.nev}/>
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