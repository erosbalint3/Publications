import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { GridRowsProp } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { Kozlemeny } from '../../Models/Kozlemeny';
import { v4 as uuidv4 } from 'uuid';
import './Kozlemenyek.css';

const displayAddNewKozlemenyPopUp = () => {
    const kozlemenyPopUp = document.getElementById('addNewKozlemenyPopUp');
    if (kozlemenyPopUp && kozlemenyPopUp.style.display === 'none') {
        kozlemenyPopUp.style.display = 'block';
    } else {
        kozlemenyPopUp!.style.display = 'none';
    }
}

const testKozlemenyek: GridRowsProp = [
    {id: uuidv4(), cim: "Teszt1", folyoirat_azon: uuidv4(), kiadas_eve: 2023},
    {id: uuidv4(), cim: "Teszt2", folyoirat_azon: uuidv4(), kiadas_eve: 2024},
    {id: uuidv4(), cim: "Teszt3", folyoirat_azon: uuidv4(), kiadas_eve: 2025},
    {id: uuidv4(), cim: "Teszt4", folyoirat_azon: uuidv4(), kiadas_eve: 2026},
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
    {field: 'cim', headerName: 'Cím', width: 200, editable: true},
    {field: 'folyoirat_azon', headerName: 'Folyóirat azonosító', width: 200},
    {field: 'kiadas_eve', headerName: 'Kiadás éve', width: 200, editable: true},
];

const Kozlemenyek = () => {
    return (
        <div id='kozlemenyekMain'>
            <div id='ButtonsGroup'>
                <button onClick={displayAddNewKozlemenyPopUp}>Add new</button>
            </div>
            <div>
                <DataGrid rows={testKozlemenyek} columns={columns} editMode='row'/>
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
                        <button onClick={displayAddNewKozlemenyPopUp}>Cancel</button>
                        <button>Add new</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Kozlemenyek;