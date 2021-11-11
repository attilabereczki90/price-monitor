import React from 'react';
import { MetaData, TimeSeriesData } from './DataTable.d';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const createData = (id: number, date: string, seriesData: TimeSeriesData) => {
  return { id, date, open: seriesData['1. open'], high: seriesData['2. high'], low: seriesData['3. low'], close: seriesData['4. close'] }
}

const DataTable = (props: any): JSX.Element => {
  const { data, timeSeries } = props;

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date/Time',
      width: 250,
      type: 'date',
    },
    { field: 'open', headerName: 'Open', width: 130, type: 'number' },
    { field: 'high', headerName: 'High', width: 130, type: 'number' },
    { field: 'low', headerName: 'Low', width: 130, type: 'number' },
    { field: 'close', headerName: 'Close', width: 130, type: 'number' },
  ];
  
  const buildTableData = (object: { [index: string]: TimeSeriesData }[]) => {
    let rows = [];

    for (const property in object) {
      const date = property;
      const seriesData: any = object[property];
      rows.push(createData(rows.length, date, seriesData));
    }

    return rows.slice(0, 30);
  };

  const buildMetaData = (metaSource: MetaData) => {
    const information = metaSource['1. Information'];
    const symbol = metaSource['2. Symbol'];
    const lastRefreshed = metaSource['3. Last Refreshed'];
    return [information, symbol, lastRefreshed];
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {data && (
        <>
          <p>
            Symbol: {buildMetaData(data['Meta Data'])[1]}, Last Refreshed: {buildMetaData(data['Meta Data'])[2]}
          </p>
          <DataGrid
            rows={buildTableData(data[timeSeries])}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </>
      )}
    </div>
  );
}

export default DataTable;
