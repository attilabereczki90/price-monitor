import { TimeSeriesData } from "./components/datatable/DataTable.d";

export const colors = {
  cyan: 'rgb(38, 166, 154)',
  cyan1: 'rgba(38, 166, 154, 0.3)',
  red: 'rgb(239, 83, 80)',
  red1: 'rgba(239, 83, 80, 0.3)',
  tealishBlue: 'rgb(224, 227, 235)',
};

export const createData = (date: string, seriesData: TimeSeriesData, id?: number) => {
  const basicSeriesData = { date, open: seriesData['1. open'], high: seriesData['2. high'], low: seriesData['3. low'], close: seriesData['4. close'] };
  if(id === undefined) {
    return { ...basicSeriesData, volume: +seriesData['5. volume'] };
  } else {
    return { id,  ...basicSeriesData};
  }
}
