import React, { useEffect, useState, useMemo } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { Kozlemeny } from '../../Models/Kozlemeny';
import { v4 as uuidv4 } from 'uuid';
import KozlemenyService from '../../Services/kozlemenyService';
import { MenuItem, Select, TextField, Dialog, DialogTitle, DialogContent, Button, Autocomplete, createTheme, ThemeProvider } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import './Kozlemenyek.css';
import SzerzoService from '../../Services/szerzoService';
import { Szerzo } from '../../Models/Szerzo';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import { ReactSession } from 'react-client-session';
import { Kiado } from '../../Models/Kiado';
import KiadoService from '../../Services/kiadoService';
import { Folyoirat } from '../../Models/Folyoirat';
import FolyoiratService from '../../Services/folyoiratService';
import { useFilePicker } from 'use-file-picker';
import { Document, Page, pdfjs } from 'react-pdf';
import { huHU } from '@mui/material/locale';

const kozlemenyService = new KozlemenyService();
const szerzoService = new SzerzoService();
const kiadoService = new KiadoService();
const folyoiratService = new FolyoiratService();

const theme = createTheme({}, huHU);

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
    const [addData, setAddData] = useState<Kozlemeny>({id: '', cim: '', folyoirat_azon: '', kiadas_eve: 0, szerzoi: [], felhasznalonev: '', publikacioTipusa: '', publikacioFajlNev: '', publikacioFajlPath: ''});
    const [kiadok, setKiadok] = useState<Kiado[]>([]);
    const [filterByKiadoDialogOpen, setFilterByKiadoDialogOpen] = useState(false);
    const [filterByTipusDialogOpen, setFilterByTipusDialogOpen] = useState(false);
    const [selectedKiadok, setSelectedKiadok] = useState<string[]>([]);
    const [kiadasEveGroup, setKiadasEveGroup] = useState<number[]>([]);
    const [filtered, setFiltered] = useState<boolean>(false);
    const [pdfString, setPdfString] = useState('');
    const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
    const [numPages, setNumPages] = useState(0);
    const [selectedTipus, setSelectedTipus] = useState<string>();
    const [selectedSzerzok, setSelectedSzerzok] = useState<string[]>([]);

    const types = ['Journal', 'Magazine', 'Report', 'Book', 'Newspaper', 'Thesis', 'Bibliography', 'Other'];

    const { plainFiles, filesContent, openFilePicker } = useFilePicker({ accept: '.pdf' });
    
    const user = ReactSession.get('user');
    const isLoggedIn = ReactSession.get('isLoggedIn');

    useEffect(() => { 
        pdfjs.GlobalWorkerOptions.workerSrc =`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.js`;
    }, []);

    let startIndex = 0;

    const handleOpen = (params: any) => {
        setSelectedSzerzok(params.row.szerzoi);
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
    }, []);

    const getSzerzoIdByName = (name: string[]) => {
        let array: string[] = [];
        name.forEach((szerzoName) => {
            szerzok.forEach((szerzo) => {
                if (szerzo.nev == szerzoName) {
                    array.push(szerzo.id);
                }
            });
        });
        return array;
    };

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

    useEffect(() => {
        const blob = new Blob([plainFiles[0]], {type: '.pdf'});
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = function() {
            setAddData({...addData, publikacioFajlPath: reader.result as string, publikacioFajlNev: plainFiles[0]?.name});
        };
    }, [filesContent]);

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

    const handleFilterByTipus = async () => {
        const tipusSelect = document.getElementById('tipusSelect') as HTMLSelectElement;
        const tipus = tipusSelect.value;
        kozlemenyService.getKozlemenyByTipus(user.felhasznalonev, selectedTipus!).then((kozl: Kozlemeny[]) => {
            setKozlemenyek(kozl);
            kozlemenyek.map(async (kozlElement: Kozlemeny) => {
                const folyoirat = await folyoiratService.getFolyoiratByKiado(tipus);
                if (kozlElement.folyoirat_azon == folyoirat.id) {
                    szerzoService.getSzerzoByKozlemeny(kozlElement.id).then((szerzoData) => {
                        kozlElement.szerzoi = szerzoData.map((szerzo) => szerzo.nev);
                        setKozlemenyek(oldArray => [...oldArray, kozlElement]);
                    });
                }
            });
        });
        
        setFilterByTipusDialogOpen(false);
    };

    const columns: GridColDef[] = [
        {
            field: 'action', 
            headerName: 'Action',
            width: 200, 
            renderCell: (params) => {
                return (
                    <div>
                        <button onClick={() => deleteKozlemeny(params.row)}>Törlés</button>
                        <button onClick={() => handleOpen(params)}>Szerkesztés</button>
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
        {
            field: 'szerzoCount',
            headerName: 'Szerzők száma',
            width: 200,
            valueGetter: (params) => {
                return params?.row?.szerzoi?.length;
            },
            type: 'number'
        },
        {field: 'publikacioTipusa', headerName: 'Publikáció típusa', width: 200},
        {field: 'publikacioFajlPath', headerName: 'Publikáció megnyitása', width: 200, renderCell: (params) => {
                return (
                    <div>
                        <button onClick={() => {
                            setPdfString(params.value);
                            setDocumentDialogOpen(true);
                        }}>Publikáció megnyitása</button>
                    </div>
                );
            }
        }
    ];

    return (
        <div id='kozlemenyekMain'>
            <div id='ButtonsGroup'>
                <button onClick={() => setAddDialogOpen(true)}>Új közlemény</button>
                <button onClick={() => setFilterByKiadoDialogOpen(true)}>Szűrés kiadó szerint</button>
                <button onClick={() => setFilterByTipusDialogOpen(true)}>Szűrés típus szerint</button>
            </div>
            <div>
                <ThemeProvider theme={theme}>
                    <DataGrid rows={kozlemenyek} columns={columns}/>  
                </ThemeProvider>          
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
                    <Button onClick={() => handleFilterByKiado()} sx={{ mt: 5}}>Szűrés</Button>
                    <Button onClick={() => setFilterByKiadoDialogOpen(false)} sx={{ mt: 5}}>Mégse</Button>
                </DialogContent>
            </Dialog>
            <Dialog open={filterByTipusDialogOpen} onClose={() => setFilterByTipusDialogOpen(false)}>
                <DialogContent>
                    <Autocomplete 
                        id='tipusSelect'
                        options={types}
                        value={selectedTipus}
                        getOptionLabel={(option) => option}
                        sx={{width: 300}}
                        renderInput={(params) => <TextField {...params} label='Típus' variant='standard'/>}
                        onChange={(event, value) => setSelectedTipus(value || '')}
                    />
                    <Button onClick={() => handleFilterByTipus()} sx={{ mt: 5}}>Szűrés</Button>
                    <Button onClick={() => setFilterByTipusDialogOpen(false)} sx={{ mt: 5}}>Mégse</Button>
                </DialogContent>
            </Dialog>
            <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
                <DialogTitle>Közlemény hozzáadása</DialogTitle>
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
                    <Autocomplete 
                        id='tipusSelect'
                        options={types}
                        value={addData?.publikacioTipusa}
                        getOptionLabel={(option) => option}
                        sx={{width: 300}}
                        renderInput={(params) => <TextField {...params} label='Típus' variant='standard'/>}
                        onChange={(event, value) => setAddData({ ...addData, publikacioTipusa: value || ''})}
                    />
                    <Select multiple value={addData?.szerzoi} sx={{width: 200, color: "black"}} onChange={(params) => setAddData({ ...addData, szerzoi: params.target.value as string[]})}>
                        {szerzok.map((szerzo) => (
                            <MenuItem 
                                key={szerzo.nev}
                                value={szerzo.id}
                            >{szerzo.nev}</MenuItem>
                        ))}
                    </Select>
                    <div>
                        <button onClick = {() => openFilePicker()}>Publikáció feltöltése</button>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddDialogOpen(false)}>Mégse</Button>
                    <Button onClick={() => handleAdd()}>Hozzáadás</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
                <DialogTitle>Közlemény szerkesztése</DialogTitle>
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
                    <Autocomplete 
                        id='tipusSelect'
                        options={types}
                        value={selectedKozlemeny?.publikacioTipusa}
                        getOptionLabel={(option) => option}
                        sx={{width: 300}}
                        renderInput={(params) => <TextField {...params} label='Típus' variant='standard'/>}
                        onChange={(event, value) => setSelectedKozlemeny({ ...selectedKozlemeny, publikacioTipusa: value || ''} as Kozlemeny)}
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
                    <Autocomplete
                        id='szerzoSelect'
                        options={szerzok.map((szerzo) => szerzo.nev)}
                        value={selectedSzerzok || []}
                        multiple
                        getOptionLabel={(option) => option}
                        sx={{width: 300}}
                        renderInput={(params) => <TextField {...params} label='Szerző' variant='standard'/>}
                        onChange={(event, value) => {
                                setSelectedKozlemeny({ ...selectedKozlemeny, szerzoi: getSzerzoIdByName(value) || []} as Kozlemeny);
                                setSelectedSzerzok(value || []);
                            }
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUpdateDialogOpen(false)}>Mégse</Button>
                    <Button onClick={() => handleSave()}>Mentés</Button>
                </DialogActions>
            </Dialog>
            <h1 style={{textAlign: 'left', marginLeft: '5px'}}>Saját közlemények évenkénti statisztikája</h1>
            {kiadasEveGroup.length > 0 &&<BarChart
                    disableAxisListener
                    xAxis={[
                        {
                            id: 'kiadasEvei',
                            data: kozlemenyek.filter((value, index, self) => self.indexOf(value) === index).filter((kozlemeny) => kozlemeny.felhasznalonev == user?.felhasznalonev).map((kozlemeny) => kozlemeny.kiadas_eve),
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
            <Dialog open={documentDialogOpen} onClose={() => setDocumentDialogOpen(false)}>
                <Document file={pdfString} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
                    {Array.apply(null, Array(numPages)).map((x, i) => i + 1).map((page) => (
                        <Page width={1850} scale={0.3} pageNumber={page} renderTextLayer={false} renderAnnotationLayer={false}/>
                    
                    ))}
                </Document>
            </Dialog>
        </div>
    )
};

export default Kozlemenyek;