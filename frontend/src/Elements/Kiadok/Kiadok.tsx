import React, { useEffect, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { GridRowsProp } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { Kiado } from '../../Models/Kiado';
import { v4 as uuidv4 } from 'uuid';
import KiadoService from '../../Services/kiadoService';
import './Kiadok.css';

const kiadoService = new KiadoService();

const displayAddNewKiadoPopUp = () => {
    const kiadoPopUp = document.getElementById('addNewKiadoPopUp');
    if (kiadoPopUp && kiadoPopUp.style.display === 'none') {
        kiadoPopUp.style.display = 'block';
    } else {
        kiadoPopUp!.style.display = 'none';
    }
}

const deleteKiado = (row: Kiado) => {
    kiadoService.deleteKiado(row);
}

const addNewKiado = () => {
    const nev = document.getElementById('addNewKiadoPopUpContent')?.getElementsByTagName('input')[0].value;
    const telszam = document.getElementById('addNewKiadoPopUpContent')?.getElementsByTagName('input')[1].value;
    const szekhely = document.getElementById('addNewKiadoPopUpContent')?.getElementsByTagName('input')[2].value;
    const newKiado: Kiado = {nev: nev!, telefonszam: telszam!, szekhely: szekhely!};
    kiadoService.addNewKiado(newKiado);
    const kiadoPopUp = document.getElementById('addNewKiadoPopUp');
    kiadoPopUp!.style.display = 'none'; 
}

const columns: GridColDef[] = [
    {
        field: 'action', 
        headerName: 'Action',
        width: 200, 
        editable: false,
        renderCell: (params) => {
            return (
                <div>
                    <button onClick={deleteKiado(params.row)!}>Delete</button>
                </div>
            )
        }
    },
    {field: 'nev', headerName: 'Név', width: 200},
    {field: 'telefonszam', headerName: 'Telefonszám', width: 200, editable: true},
    {field: 'szekhely', headerName: 'Székhely', width: 200, editable: true},
];

const Kiadok = () => {
    const [kiadok, setKiadok] = useState<Kiado[]>([]);

    useEffect(() => {
        kiadoService.getAllKiado().then((response) => {
            setKiadok(response);
        });
    }, []);

    return (
        <div id='kiadokMain'>
            <div id='ButtonsGroup'>
                <button onClick={displayAddNewKiadoPopUp}>Add new</button>
            </div>
            <div>
                <DataGrid rows={kiadok} columns={columns} editMode='row' getRowId={(row) => row.nev}/>
            </div>
            <div id='addNewKiadoPopUp'>
                <div id='addNewKiadoPopUpContent'>
                    <div>
                        <label>Név</label>
                        <input type='text' />
                    </div>
                    <div>
                        <label>Telefonszám</label>
                        <input type='text' />
                    </div>
                    <div>
                        <label>Székhely</label>
                        <input type='text' />
                    </div>
                    <div>
                        <button onClick={displayAddNewKiadoPopUp}>Cancel</button>
                        <button onClick={addNewKiado}>Add new</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Kiadok;