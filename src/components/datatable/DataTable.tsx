import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import MonitorHeader from '../monitorheader/MonitorHeader';
import { createData } from '../../utils';
import { IDataProps, TimeSeriesData } from '../../types/GlobalTypes.d';

const DataTable = (props: IDataProps): JSX.Element => {
  const { data, timeSeries } = props;
  const [pageSize, setPageSize] = useState<number>(10);

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
  const rowsPerPageOptions = [5, 10, 20, 30];
  
  const buildTableData = (object: { [index: string]: TimeSeriesData }[]) => {
    let rows = [];

    for (const property in object) {
      const date = property;
      const seriesData: any = object[property];
      rows.push(createData(date, seriesData, rows.length));
    }

    return rows.slice(0, 30);
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {data && (
        <>
          <MonitorHeader data={data} />
          <DataGrid
            rows={buildTableData(data[timeSeries])}
            columns={columns}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            rowsPerPageOptions={rowsPerPageOptions}
          />
        </>
      )}
    </div>
  );
}

export default DataTable;
