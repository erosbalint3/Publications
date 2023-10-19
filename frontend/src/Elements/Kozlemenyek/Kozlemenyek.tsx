import React, { useEffect, useState, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { Kozlemeny } from '../../Models/Kozlemeny';
import { v4 as uuidv4 } from 'uuid';
import KozlemenyService from '../../Services/kozlemenyService';
import { MenuItem, Select, TextField, Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import './Kozlemenyek.css';
import SzerzoService from '../../Services/szerzoService';
import { Szerzo } from '../../Models/Szerzo';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';

const kozlemenyService = new KozlemenyService();
const szerzoService = new SzerzoService();

const deleteKozlemeny = (kozlemeny: Kozlemeny) => {
    kozlemenyService.deleteKozlemeny(kozlemeny);
    window.location.reload();
};

const Kozlemenyek = () => {
    const [kozlemenyek, setKozlemenyek] = useState<Kozlemeny[]>([]);
    const [szerzok, setSzerzok] = useState<Szerzo[]>([]);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [selectedKozlemeny, setSelectedKozlemeny] = useState<Kozlemeny>();
    const [addData, setAddData] = useState<Kozlemeny>({id: '', cim: '', folyoirat_azon: '', kiadas_eve: 0, szerzoi: [], felhasznalonev: ''});

    const handleOpen = (params: any) => {
        setSelectedKozlemeny(params.row);
        setUpdateDialogOpen(true);
    };

    const handleAdd = () => {
        kozlemenyService.addNewKozlemeny({...addData, id: uuidv4()});
        setAddDialogOpen(false);
        window.location.reload();
    };

    const handleSave = () => {
        kozlemenyService.saveKozlemeny(selectedKozlemeny!);
        setUpdateDialogOpen(false);
        window.location.reload();
    };

    useEffect(() => {
         kozlemenyService.getAllKozlemeny().then((kozlemenyek) => {
            setKozlemenyek(kozlemenyek);
            szerzoService.getAllSzerzo().then((szerzok) => {
                setSzerzok(szerzok);
            });
            kozlemenyek.map((kozlemeny: Kozlemeny) => {
                szerzoService.getSzerzoByKozlemeny(kozlemeny.id).then((szerzoData) => {
                    kozlemeny.szerzoi = szerzoData.map((szerzo) => szerzo.nev);
                    setKozlemenyek([...kozlemenyek]);
                });
            });
        });
    }, []);

    const columns: GridColDef[] = [
        {
            field: 'action', 
            headerName: 'Action',
            width: 200, 
            renderCell: (params) => {
                return (
                    <div>
                        <button onClick={() => deleteKozlemeny(params.row)}>Delete</button>
                        <button onClick={() => handleOpen(params)}>Update</button>
                    </div>
                )
            }
        },
        {field: 'id', headerName: 'ID', width: 200},
        {field: 'cim', headerName: 'Cím', width: 200},
        {field: 'folyoirat_azon', headerName: 'Folyóirat azonosító', width: 200},
        {field: 'kiadas_eve', headerName: 'Kiadás éve', width: 200},
        {
            field: 'szerzoi', 
            headerName: 'Szerzői', 
            width: 200, 
            type: 'text',
            valueFormatter: (params) => {
                return params?.value?.join(', ');
            }            
        },
    ];

    return (
        <div id='kozlemenyekMain'>
            <div id='ButtonsGroup'>
                <button onClick={() => setAddDialogOpen(true)}>Add new</button>
            </div>
            <div>
                <DataGrid rows={kozlemenyek} columns={columns} editMode='row'/>
            </div>
            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
                <DialogTitle>Subscribe</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="Cím"
                        label="Cím"
                        type="text"
                        value={addData?.cim}
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setAddData({ ...addData, cim: event.target.value });
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="Folyóirat azonosító"
                        label="Folyóirat azonosító"
                        type="text"
                        value={addData?.folyoirat_azon}
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setAddData({ ...addData, folyoirat_azon: event.target.value });
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="Kiadás éve"
                        label="Kiadás éve"
                        value={addData?.kiadas_eve}
                        type="year"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setAddData({ ...addData, kiadas_eve: parseInt(event.target.value) });
                        }}
                    />
                    <Select multiple value={addData?.szerzoi} sx={{width: 200, color: "black"}} onChange={(params) => setAddData({ ...addData, szerzoi: params.target.value as string[]})}>
                            {szerzok.map((szerzo) => (
                                <MenuItem 
                                    key={szerzo.nev}
                                    value={szerzo.nev}
                                >{szerzo.nev}</MenuItem>
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
                    <DialogContentText>
                        ID: {selectedKozlemeny?.id}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="Cím"
                        label="Cím"
                        type="text"
                        value={selectedKozlemeny?.cim}
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setSelectedKozlemeny({ ...selectedKozlemeny, cim: event.target.value! } as Kozlemeny);
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="Folyóirat azonosító"
                        label="Folyóirat azonosító"
                        type="text"
                        value={selectedKozlemeny?.folyoirat_azon}
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setSelectedKozlemeny({ ...selectedKozlemeny, folyoirat_azon: event.target.value! } as Kozlemeny);
                        }}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="Kiadás éve"
                        label="Kiadás éve"
                        value={selectedKozlemeny?.kiadas_eve}
                        type="year"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        variant="standard"
                        onChange={(event) => {
                            setSelectedKozlemeny({ ...selectedKozlemeny, kiadas_eve: parseInt(event.target.value!) } as Kozlemeny);
                        }}
                    />
                    <Select multiple value={selectedKozlemeny?.szerzoi} sx={{width: 200, color: "black"}} onChange={(event) => {
                        setSelectedKozlemeny({ ...selectedKozlemeny, szerzoi: event.target.value as string[] } as Kozlemeny);
                    }}>
                            {szerzok.map((szerzo) => (
                                <MenuItem 
                                    key={szerzo.nev}
                                    value={szerzo.nev}
                                >{szerzo.nev}</MenuItem>
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

export default Kozlemenyek;