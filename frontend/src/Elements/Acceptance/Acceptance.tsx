import React, { useState, useMemo, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { GridRowsProp } from '@mui/x-data-grid';
import { GridColDef } from '@mui/x-data-grid';
import AcceptanceService from '../../Services/acceptanceService';
import { Kozlemeny } from '../../Models/Kozlemeny';
import { ThemeProvider, createTheme } from '@mui/material';
import { huHU } from '@mui/material/locale';

const acceptanceService = new AcceptanceService();

const Acceptance = () => {
    const [kozlemenyek, setKozlemenyek] = useState<Kozlemeny[]>([]);

    useEffect(() => {
        acceptanceService.getAllKozlemenyWaitingForAcceptance().then(data => setKozlemenyek(data));
    }, []);

    const theme = createTheme({}, huHU);

    const columns: GridColDef[] = [
        {field: 'cim', headerName: 'Cím', width: 200, editable: false},
        {
            field: 'action', 
            headerName: 'Funkciók',
            width: 200, 
            editable: false,
            renderCell: (params) => {
                return (
                    <div>
                        <button onClick={() => acceptanceService.acceptKozlemeny(params.id.toString())}>Elfogad</button>
                        <button onClick={() => acceptanceService.rejectKozlemeny(params.id.toString())}>Elutasít</button>
                    </div>
                )
            }
        },
    ];

    return (
        <div>
             <div>
                <ThemeProvider theme={theme}>
                    <DataGrid rows={kozlemenyek} columns={columns} editMode='row' getRowId={(row) => row.id}/>
                </ThemeProvider>
            </div>
        </div>
    );
};

export default Acceptance;