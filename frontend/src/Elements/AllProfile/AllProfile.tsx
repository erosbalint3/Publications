import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { GridRowsProp } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import { User } from '../../Models/User';
import UserService from '../../Services/userService';
import './AllProfile.css';

const userService = new UserService();

const AllProfile = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        userService.getAllUser().then(data => setUsers(data));
    }, []);

    const columns: GridColDef[] = [
        {field: 'felhasznalonev', headerName: 'Felhasználónév', width: 200, editable: false},
        {field: 'email', headerName: 'Email', width: 200, editable: false},
        {field: 'jogosultsag', headerName: 'Jogosultság', width: 200, editable: false},
    ];

    return (
        <div>
            <div id='mainTable'>
                <DataGrid rows={users} columns={columns} editMode='row' getRowId={(row) => row.felhasznalonev}/>
            </div>
        </div>
    );
};

export default AllProfile;