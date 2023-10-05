import React from "react";
import { DataGrid } from '@mui/x-data-grid';
import { GridRowsProp } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { Folyoirat } from '../../Models/Folyoirat';
import { v4 as uuidv4 } from 'uuid';
import './Folyoiratok.css';

const displayAddNewFolyoiratPopUp = () => {
    const folyoiratPopUp = document.getElementById('addNewFolyoiratPopUp');
    if (folyoiratPopUp && folyoiratPopUp.style.display === 'none') {
        folyoiratPopUp.style.display = 'block';
    } else {
        folyoiratPopUp!.style.display = 'none';
    }
}

const testFolyoiratok: GridRowsProp = [
    {id: uuidv4(), nev: "Teszt1", szerkeszto: 'Teszt1', nyelv: "Teszt1", minosites: "Teszt1", kiado: uuidv4()},
    {id: uuidv4(), nev: "Teszt2", szerkeszto: 'Teszt2', nyelv: "Teszt2", minosites: "Teszt2", kiado: uuidv4()},
    {id: uuidv4(), nev: "Teszt3", szerkeszto: 'Teszt3', nyelv: "Teszt3", minosites: "Teszt3", kiado: uuidv4()},
    {id: uuidv4(), nev: "Teszt4", szerkeszto: 'Teszt4', nyelv: "Teszt4", minosites: "Teszt4", kiado: uuidv4()},
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
    {field: 'szerkeszto', headerName: 'Szerkesztő', width: 200, editable: true},
    {field: 'nyelv', headerName: 'Nyelv', width: 200, editable: true},
    {field: 'minosites', headerName: 'Minősítés', width: 200, editable: true},
    {field: 'kiado', headerName: 'Kiadó', width: 200},
];

const Folyoiratok = () => {
    return (
        <div id="folyoiratokMain">
            <div id='ButtonsGroup'>
                <button onClick={displayAddNewFolyoiratPopUp}>Add new</button>
            </div>
            <div>
                <DataGrid rows={testFolyoiratok} columns={columns} editMode='row'/>
            </div>
            <div id='addNewFolyoiratPopUp'>
                <div id='addNewFolyoiratPopUpContent'>
                    <div>
                        <label>Név</label>
                        <input type='text' />
                    </div>
                    <div>
                        <label>Szerkesztő</label>
                        <input type='text' />
                    </div>
                    <div>
                        <label>Nyelv</label>
                        <input type='text' />
                    </div>
                    <div>
                        <label>Minősítés</label>
                        <input type='text' />
                    </div>
                    <div>
                        <button onClick={displayAddNewFolyoiratPopUp}>Cancel</button>
                        <button>Add new</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Folyoiratok;