import React from "react";
import { DataGrid } from '@mui/x-data-grid';
import { GridRowsProp } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { Szerzo } from '../../Models/Szerzo';
import { v4 as uuidv4 } from 'uuid';
import './Szerzok.css';

const displayAddNewSzerzoPopUp = () => {
    const szerzoPopUp = document.getElementById('addNewSzerzoPopUp');
    if (szerzoPopUp && szerzoPopUp.style.display === 'none') {
        szerzoPopUp.style.display = 'block';
    } else {
        szerzoPopUp!.style.display = 'none';
    }
}

const testSzerzok: GridRowsProp = [
    {id: uuidv4(), nev: "Teszt1", nemzetiseg: 'Teszt1', email: 'Teszt1', affiliacio: 'Teszt1'},
    {id: uuidv4(), nev: "Teszt2", nemzetiseg: 'Teszt2', email: 'Teszt2', affiliacio: 'Teszt2'},
    {id: uuidv4(), nev: "Teszt3", nemzetiseg: 'Teszt3', email: 'Teszt3', affiliacio: 'Teszt3'},
    {id: uuidv4(), nev: "Teszt4", nemzetiseg: "Teszt4", email: 'Teszt4', affiliacio: 'Teszt4'},
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
    {field: 'id', headerName: 'ID', width: 200},
    {field: 'nev', headerName: 'Név', width: 200, editable: true},
    {field: 'nemzetiseg', headerName: 'Nemzetiség', width: 200, editable: true},
    {field: 'email', headerName: 'Email', width: 200, editable: true},
    {field: 'affiliacio', headerName: 'Affiliáció', width: 200, editable: true},
];

const Szerzok = () => {
    return (
        <div id='szerzokMain'>
            <div id='ButtonsGroup'>
                <button onClick={displayAddNewSzerzoPopUp}>Add new</button>
            </div>
            <div>
                <DataGrid rows={testSzerzok} columns={columns} editMode='row'/>
            </div>
            <div id='addNewSzerzoPopUp'>
                <div id='addNewSzerzoPopUpContent'>
                    <div>
                        <label>Név</label>
                        <input type='text' />
                    </div>
                    <div>
                        <label>Nemzetiség</label>
                        <input type='text' />
                    </div>
                    <div>
                        <label>Email</label>
                        <input type='text' />
                    </div>
                    <div>
                        <label>Affiliáció</label>
                        <input type='text' />
                    </div>
                    <div>
                        <button onClick={displayAddNewSzerzoPopUp}>Cancel</button>
                        <button>Add new</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Szerzok;