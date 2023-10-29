import React, { useEffect, useState, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { Kozlemeny } from '../../Models/Kozlemeny';
import { v4 as uuidv4 } from 'uuid';
import KozlemenyService from '../../Services/kozlemenyService';
import { MenuItem, Select, TextField, Dialog, DialogTitle, DialogContent, Button, Autocomplete } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import './Kozlemenyek.css';
import SzerzoService from '../../Services/szerzoService';
import { Szerzo } from '../../Models/Szerzo';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import { ReactSession } from 'react-client-session';
import { Kiado } from '../../Models/Kiado';
import KiadoService from '../../Services/kiadoService';
import { alignProperty } from '@mui/material/styles/cssUtils';
import { Folyoirat } from '../../Models/Folyoirat';
import FolyoiratService from '../../Services/folyoiratService';

const kozlemenyService = new KozlemenyService();
const szerzoService = new SzerzoService();
const kiadoService = new KiadoService();
const folyoiratService = new FolyoiratService();

const deleteKozlemeny = (kozlemeny: Kozlemeny) => {
    kozlemenyService.deleteKozlemeny(kozlemeny);
    window.location.reload();
};

const Kozlemenyek = () => {
    const [kozlemenyek, setKozlemenyek] = useState<Kozlemeny[]>([]);
    const [szerzok, setSzerzok] = useState<Szerzo[]>([]);
    const [folyoiratok, setFolyoiratok] = useState<Folyoirat[]>([]);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
    const [selectedKozlemeny, setSelectedKozlemeny] = useState<Kozlemeny>();
    const [addData, setAddData] = useState<Kozlemeny>({id: '', cim: '', folyoirat_azon: '', kiadas_eve: 0, szerzoi: [], felhasznalonev: ''});
    const [kiadok, setKiadok] = useState<Kiado[]>([]);
    const [filterByKiadoDialogOpen, setFilterByKiadoDialogOpen] = useState(false);
    const [selectedKiadok, setSelectedKiadok] = useState<string[]>([]);
    const [kiadasEveGroup, setKiadasEveGroup] = useState<number[]>([]);
    const [filtered, setFiltered] = useState<boolean>(false);

    const user = ReactSession.get('user');
    const isLoggedIn = ReactSession.get('isLoggedIn');

    let startIndex = 0;

    const handleOpen = (params: any) => {
        setSelectedKozlemeny(params.row);
        setUpdateDialogOpen(true);
    };

    const handleAdd = () => {
        kozlemenyService.addNewKozlemeny({...addData, id: uuidv4(), felhasznalonev: user?.felhasznalonev!});
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
            if (!filtered) {
                setKozlemenyek(kozlemenyek);
            }
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
        kiadoService.getAllKiado().then((kiadok) => {
            setKiadok(kiadok);
        });
        folyoiratService.getAllFolyoirat().then((folyoiratok) => {
            setFolyoiratok(folyoiratok);
        });
        if (startIndex == 0 && !isLoggedIn) {
            alert('You are not logged in!');
            window.location.href = '/login';
            startIndex++;
        }
        console.log(kozlemenyek);
    }, []);

    const getFolyoiratNevById = (id: string) => {
        return folyoiratok.find((folyoirat) => folyoirat.id == id)?.nev;
    }

    function dynamicSort(property: keyof Kozlemeny) {
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
        }
        return function (a: Kozlemeny,b: Kozlemeny) {
            var result = (a[property]! < b[property]!) ? -1 : (a[property]! > b[property]!) ? 1 : 0;
            return result * sortOrder;
        }
    }

    useEffect(() => {
        let array: number[] = [];
        let usedUpEvek: number[] = [];
        const sortedKozlemenyek = [...kozlemenyek].sort(dynamicSort('kiadas_eve'));
        sortedKozlemenyek.forEach((kozlemeny) => {
            let count = kozlemenyek.filter((kozl) => kozl.kiadas_eve == kozlemeny.kiadas_eve && kozl.felhasznalonev == user.felhasznalonev).length;
            if (!usedUpEvek.includes(kozlemeny.kiadas_eve)) {
                usedUpEvek.push(kozlemeny.kiadas_eve);
                array.push(parseInt(count.toString()));
            }
        });
        setKiadasEveGroup(array);

    }, [kozlemenyek]);

    const handleFilterByKiado = async () => {
        const kiadoSelect = document.getElementById('kiadoSelect') as HTMLSelectElement;
        const kiado = kiadoSelect.value;
        kozlemenyService.getKozlemenyByKiado(selectedKiadok[0]).then((kozl: Kozlemeny[]) => {
            setKozlemenyek(kozl);
            kozlemenyek.map(async (kozlElement: Kozlemeny) => {
                const folyoirat = await folyoiratService.getFolyoiratByKiado(kiado);
                if (kozlElement.folyoirat_azon == folyoirat.id) {
                    szerzoService.getSzerzoByKozlemeny(kozlElement.id).then((szerzoData) => {
                        kozlElement.szerzoi = szerzoData.map((szerzo) => szerzo.nev);
                        setKozlemenyek(oldArray => [...oldArray, kozlElement]);
                    });
                }
            });
        });
        
        setFilterByKiadoDialogOpen(false);
    };

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
        {field: 'folyoirat_azon', headerName: 'Folyóirat azonosító', width: 200, valueGetter: (params) => getFolyoiratNevById(params.row.folyoirat_azon)},
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
                <button onClick={() => setFilterByKiadoDialogOpen(true)}>Filter by Kiado</button>
            </div>
            <div>
                <DataGrid rows={kozlemenyek} columns={columns}/>
                
            </div>
            <Dialog open={filterByKiadoDialogOpen} onClose={() => setFilterByKiadoDialogOpen(false)}>
                <DialogContent>
                    <Autocomplete 
                        id='kiadoSelect'
                        options={kiadok.map((kiado) => kiado.nev)}
                        value={selectedKiadok}
                        multiple
                        getOptionLabel={(option) => option}
                        sx={{width: 300}}
                        renderInput={(params) => <TextField {...params} label='Kiadó' variant='standard'/>}
                        onChange={(event, value) => setSelectedKiadok(value)}
                    />
                    <Button onClick={() => handleFilterByKiado()} sx={{ mt: 5}}>Filter</Button>
                    <Button onClick={() => setFilterByKiadoDialogOpen(false)} sx={{ mt: 5}}>Cancel</Button>
                </DialogContent>
            </Dialog>
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
                    <Select value={addData?.folyoirat_azon} sx={{width: 200, color: "black"}} onChange={(params) => setAddData({ ...addData, folyoirat_azon: params.target.value as string})}>
                        {folyoiratok.map((folyoirat) => (
                            <MenuItem 
                                key={folyoirat.nev}
                                value={folyoirat.id}
                            >{folyoirat.nev}</MenuItem>
                        ))}
                    </Select>
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
                                value={szerzo.id}
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
                    <Select value={selectedKozlemeny?.folyoirat_azon} sx={{width: 200, color: "black"}} onChange={(params) => setSelectedKozlemeny({ ...selectedKozlemeny, folyoirat_azon: params.target.value as string} as Kozlemeny)}>
                        {folyoiratok.map((folyoirat) => (
                            <MenuItem 
                                key={folyoirat.nev}
                                value={folyoirat.id}
                            >{folyoirat.nev}</MenuItem>
                        ))}
                    </Select>
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
            <h1 style={{textAlign: 'left', marginLeft: '5px'}}>Saját közlemények évenkénti statisztikája</h1>
            {kiadasEveGroup.length > 0 &&<BarChart
                        disableAxisListener
                        xAxis={[
                            {
                                id: 'kiadasEvei',
                                data: kozlemenyek.filter((value, index, self) => self.indexOf(value) === index).filter((kozlemeny) => kozlemeny.felhasznalonev == user?.felhasznalonev).map((kozlemeny) => kozlemeny.kiadas_eve).sort(),
                                scaleType: 'band',
                            }
                        ]}
                        yAxis={[
                            {
                                valueFormatter: (params) => {
                                    return params.toFixed(0);
                                }
                            }
                        ]}
                        series={[
                            {
                                data: kiadasEveGroup
                            }
                        ]}
                        height={300}
                        
                    />
                }
        </div>
    )
};

export default Kozlemenyek;