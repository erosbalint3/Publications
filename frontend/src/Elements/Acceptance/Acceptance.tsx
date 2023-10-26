import React, { useState, useMemo, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { GridRowsProp } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import AcceptanceService from '../../Services/acceptanceService';
import { Kozlemeny } from '../../Models/Kozlemeny';

const acceptanceService = new AcceptanceService();

const Acceptance = () => {
    const [kozlemenyek, setKozlemenyek] = useState<Kozlemeny[]>([]);

    useEffect(() => {
        acceptanceService.getAllKozlemenyWaitingForAcceptance().then(data => setKozlemenyek(data));
    }, []);

    const columns: GridColDef[] = [
        {field: 'cim', headerName: 'Cím', width: 200, editable: false},
        {
            field: 'action', 
            headerName: 'Action',
            width: 200, 
            editable: false,
            renderCell: (params) => {
                return (
                    <div>
                        <button onClick={() => acceptanceService.acceptKozlemeny(params.id.toString())}>Accept</button>
                        <button onClick={() => acceptanceService.rejectKozlemeny(params.id.toString())}>Reject</button>
                    </div>
                )
            }
        },
    ];

    return (
        <div>
             <div>
                <DataGrid rows={kozlemenyek} columns={columns} editMode='row' getRowId={(row) => row.id}/>
            </div>
        </div>
    );
};

export default Acceptance;