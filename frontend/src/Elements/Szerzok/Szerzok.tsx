import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { GridRowsProp } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { Szerzo } from '../../Models/Szerzo';
import { v4 as uuidv4 } from 'uuid';
import SzerzoService from "../../Services/szerzoService";
import './Szerzok.css';

const szerzoService = new SzerzoService();

const displayAddNewSzerzoPopUp = () => {
    const szerzoPopUp = document.getElementById('addNewSzerzoPopUp');
    if (szerzoPopUp && szerzoPopUp.style.display === 'none') {
        szerzoPopUp.style.display = 'block';
    } else {
        szerzoPopUp!.style.display = 'none';
    }
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
                    <button onClick={deleteSzerzo(params.row)!}>Delete</button>
                </div>
            )
        }
    },
    {field: 'id', headerName: 'ID', width: 200, editable: true}
    {field: 'nev', headerName: 'Név', width: 200, editable: true},
    {field: 'nemzetiseg', headerName: 'Nemzetiség', width: 200, editable: true},
    {field: 'email', headerName: 'Email', width: 200, editable: true},
    {field: 'affiliacio', headerName: 'Affiliáció', width: 200, editable: true},
];

const addNewSzerzo = () => {
    const nev = document.getElementById('addNewSzerzoPopUpContent')?.getElementsByTagName('input')[0].value;
    const nemzetiseg = document.getElementById('addNewSzerzoPopUpContent')?.getElementsByTagName('input')[1].value;
    const email = document.getElementById('addNewSzerzoPopUpContent')?.getElementsByTagName('input')[2].value;
    const affiliacio = document.getElementById('addNewSzerzoPopUpContent')?.getElementsByTagName('input')[3].value;
    const newSzerzo: Szerzo = {id: uuidv4(), nev: nev!, nemzetiseg: nemzetiseg!, email: email!, affiliacio: affiliacio!};
    szerzoService.addNewSzerzo(newSzerzo);
    const szerzoPopUp = document.getElementById('addNewSzerzoPopUp');
    szerzoPopUp!.style.display = 'none';
};

const deleteSzerzo = (row: Szerzo) => {
    szerzoService.deleteSzerzo(row);
};

const Szerzok = () => {
    const [szerzok, setSzerzok] = useState<Szerzo[]>([]);

    useEffect(() => {
        szerzoService.getAllSzerzo().then(data => setSzerzok(data));
    }, []);

    return (
        <div id='szerzokMain'>
            <div id='ButtonsGroup'>
                <button onClick={displayAddNewSzerzoPopUp}>Add new</button>
            </div>
            <div>
                <DataGrid rows={szerzok} columns={columns} editMode='row' getRowId={(row) => row.nev}/>
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
                        <button onClick={addNewSzerzo}>Add new</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Szerzok;