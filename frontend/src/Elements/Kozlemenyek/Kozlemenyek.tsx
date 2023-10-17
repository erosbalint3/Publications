import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { GridRowsProp } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { Kozlemeny } from '../../Models/Kozlemeny';
import { v4 as uuidv4 } from 'uuid';
import KozlemenyService from '../../Services/kozlemenyService';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import './Kozlemenyek.css';
import SzerzoService from '../../Services/szerzoService';
import { Szerzo } from '../../Models/Szerzo';

const kozlemenyService = new KozlemenyService();
const szerzoService = new SzerzoService();

let szerzok: Szerzo[] = [{} as Szerzo];
szerzoService.getAllSzerzo()
    .then((result) => {
        szerzok = result;
    })

const displayAddNewKozlemenyPopUp = () => {
    const kozlemenyPopUp = document.getElementById('addNewKozlemenyPopUp');
    if (kozlemenyPopUp && kozlemenyPopUp.style.display === 'none') {
        kozlemenyPopUp.style.display = 'block';
    } else {
        kozlemenyPopUp!.style.display = 'none';
    }
}

const testKozlemenyek: GridRowsProp = [
    {id: uuidv4(), cim: "Teszt1", folyoirat_azon: uuidv4(), kiadas_eve: 2023, felhasznalonev: 'Teszt1'},
    {id: uuidv4(), cim: "Teszt2", folyoirat_azon: uuidv4(), kiadas_eve: 2024, felhasznalonev: 'Teszt2'},
    {id: uuidv4(), cim: "Teszt3", folyoirat_azon: uuidv4(), kiadas_eve: 2025, felhasznalonev: 'Teszt3'},
    {id: uuidv4(), cim: "Teszt4", folyoirat_azon: uuidv4(), kiadas_eve: 2026, felhasznalonev: 'Teszt4'},
];




const columns: GridColDef[] = [
    {
        field: 'action', 
        headerName: 'Action',
        width: 200, 
        editable: false,
        renderCell: (params) => {
            return (
                <div>
                    <button onClick={deleteKozlemeny(params.row)!}>Delete</button>
                </div>
            )
        }
    },
    {field: 'id', headerName: 'ID', width: 200},
    {field: 'cim', headerName: 'Cím', width: 200, editable: true},
    {field: 'folyoirat_azon', headerName: 'Folyóirat azonosító', width: 200},
    {field: 'kiadas_eve', headerName: 'Kiadás éve', width: 200, editable: true},
    {
        field: 'szerzoi', 
        headerName: 'Szerzői', 
        width: 200, 
        editable: true,
        renderCell: () => {
            return <Select multiple >
                {szerzok.map((szerzo) => (
                    <MenuItem 
                        key={szerzo.nev}
                        value={szerzo.nev}
                    >{szerzo.nev}</MenuItem>
                ))}
            </Select>
        }
    },
];

const addNewKozlemeny = () => {
    const cim = document.getElementById('addNewKozlemenyPopUpContent')?.getElementsByTagName('input')[0].value;
    const folyoirat_azon = document.getElementById('addNewKozlemenyPopUpContent')?.getElementsByTagName('input')[1].value;
    const kiadas_eve = document.getElementById('addNewKozlemenyPopUpContent')?.getElementsByTagName('input')[2].value;
    const newKozlemeny: Kozlemeny = {id: uuidv4(), cim: cim!, folyoirat_azon: folyoirat_azon!, kiadas_eve: parseInt(kiadas_eve!)};
    kozlemenyService.addNewKozlemeny(newKozlemeny);
    const kozlemenyPopUp = document.getElementById('addNewKozlemenyPopUp');
    kozlemenyPopUp!.style.display = 'none'; 
};

const deleteKozlemeny = (kozlemeny: Kozlemeny) => {
    kozlemenyService.deleteKozlemeny(kozlemeny);
};

const Kozlemenyek = () => {
    const [kozlemenyek, setKozlemenyek] = useState<Kozlemeny[]>([]);
    const [selectedSzerzok, setSelectedSzerzok] = useState<Szerzo[]>([]);

    useEffect(() => {
        kozlemenyService.getAllKozlemeny().then((data) => {
            setKozlemenyek(data);
        });
    }, []);

    const addSzerzo = (event: SelectChangeEvent<typeof selectedSzerzok>) => {
        const {
            target: { value }
        } = event;
        if (value) {
            setSelectedSzerzok(value as Szerzo[]);
        }
    };

    return (
        <div id='kozlemenyekMain'>
            <div id='ButtonsGroup'>
                <button onClick={displayAddNewKozlemenyPopUp}>Add new</button>
            </div>
            <div>
                <DataGrid rows={kozlemenyek} columns={columns} editMode='row'/>
            </div>
            <div id='addNewKozlemenyPopUp'>
                <div id='addNewKozlemenyPopUpContent'>
                    <div>
                        <label>Cím</label>
                        <input type='text' />
                    </div>
                    <div>
                        <label>Folyóirat</label>
                        <input type='text' />
                    </div>
                    <div>
                        <label>Kiadás éve</label>
                        <input type='text' />
                    </div>
                    <div>
                        <label>Felhasználónév</label>
                        <input type='text' />
                    </div>
                    <div>
                        <label>Szerzoi</label><br></br>
                        <Select multiple value={selectedSzerzok} sx={{width: 200, color: "white"}} onChange={addSzerzo}>
                            {szerzok.map((szerzo) => (
                                <MenuItem 
                                    key={szerzo.nev}
                                    value={szerzo.nev}
                                >{szerzo.nev}</MenuItem>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <button onClick={displayAddNewKozlemenyPopUp}>Cancel</button>
                        <button onClick={addNewKozlemeny}>Add new </button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Kozlemenyek;