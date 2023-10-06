import React, { useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { GridRowsProp } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { Folyoirat } from '../../Models/Folyoirat';
import { v4 as uuidv4 } from 'uuid';
import './Folyoiratok.css';
import { useEffect } from "react";
import FolyoiratService from "../../Services/folyoiratService";

const folyoiratService = new FolyoiratService();

const displayAddNewFolyoiratPopUp = () => {
    const folyoiratPopUp = document.getElementById('addNewFolyoiratPopUp');
    if (folyoiratPopUp && folyoiratPopUp.style.display === 'none') {
        folyoiratPopUp.style.display = 'block';
    } else {
        folyoiratPopUp!.style.display = 'none';
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
                    <button onClick={deleteFolyoirat(params.row)!}>Delete</button>
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

const addNewFolyoirat = () => {
    const nev = document.getElementById('addNewFolyoiratPopUpContent')?.getElementsByTagName('input')[0].value;
    const szerkeszto = document.getElementById('addNewFolyoiratPopUpContent')?.getElementsByTagName('input')[1].value;
    const nyelv = document.getElementById('addNewFolyoiratPopUpContent')?.getElementsByTagName('input')[2].value;
    const minosites = document.getElementById('addNewFolyoiratPopUpContent')?.getElementsByTagName('input')[3].value;
    const newFolyoirat: Folyoirat = {id: uuidv4(), nev: nev!, szerkeszto: szerkeszto!, nyelv: nyelv!, minosites: minosites!, kiado: uuidv4()};
    folyoiratService.addNewFolyoirat(newFolyoirat);
    const folyoiratPopUp = document.getElementById('addNewFolyoiratPopUp');
    folyoiratPopUp!.style.display = 'none';
};

const deleteFolyoirat = (row: Folyoirat) => {
    folyoiratService.deleteFolyoirat(row);
};

const Folyoiratok = () => {
    const [folyoiratok, setFolyoiratok] = useState<Folyoirat[]>([]);

    useEffect(() => {
        folyoiratService.getAllFolyoirat().then((response) => {
            setFolyoiratok(response);
        });
    }, []);

    return (
        <div id="folyoiratokMain">
            <div id='ButtonsGroup'>
                <button onClick={displayAddNewFolyoiratPopUp}>Add new</button>
            </div>
            <div>
                <DataGrid rows={folyoiratok} columns={columns} editMode='row'/>
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
                        <button onClick={addNewFolyoirat}>Add new</button>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Folyoiratok;