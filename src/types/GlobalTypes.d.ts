export interface IDataProps {
  data: any;
  timeSeries: string;
};

export type TimeSeriesData = {
  '1. open': string;
  '2. high': string;
  '3. low': string;
  '4. close': string;
  '5. volume': string;
}

export type MetaData = {
  '1. Information': string;
  '2. Symbol': string;
  '3. Last Refreshed': string;
  '4. Time Zone': string;
}
