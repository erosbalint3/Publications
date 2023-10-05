import React from "react";
import { DataGrid } from '@mui/x-data-grid';
import { GridRowsProp } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { Kiado } from '../../Models/Kiado';
import { v4 as uuidv4 } from 'uuid';
import './Kiadok.css';

const displayAddNewKiadoPopUp = () => {
    const kiadoPopUp = document.getElementById('addNewKiadoPopUp');
    if (kiadoPopUp && kiadoPopUp.style.display === 'none') {
        kiadoPopUp.style.display = 'block';
    } else {
        kiadoPopUp!.style.display = 'none';
    }
}

const testKiadok: GridRowsProp = [
    {nev: "Teszt1", telszam: 'Teszt1', szekhely: 'Teszt1'},
    {nev: "Teszt2", telszam: 'Teszt2', szekhely: 'Teszt2'},
    {nev: "Teszt3", telszam: 'Teszt3', szekhely: 'Teszt3'},
    {nev: "Teszt4", telszam: 'Teszt4', szekhely: 'Teszt4'},
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
                    <button>Delete</button>
                </div>
            )
        }
    },
    {field: 'nev', headerName: 'Név', width: 200},
    {field: 'telszam', headerName: 'Telefonszám', width: 200, editable: true},
    {field: 'szekhely', headerName: 'Székhely', width: 200, editable: true},
];

const Kiadok = () => {
    return (
        <div id='kiadokMain'>
            <div id='ButtonsGroup'>
                <button onClick={displayAddNewKiadoPopUp}>Add new</button>
            </div>
            <div>
                <DataGrid rows={testKiadok} columns={columns} editMode='row' getRowId={(row) => row.nev}/>
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
                        <button>Add new</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Kiadok;