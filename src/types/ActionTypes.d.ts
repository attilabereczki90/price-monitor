export type DataDetails = {
  securityTicker: string;
  timeSeries: typeof TimeSeries[number];
};

export const TimeSeries = <const>[
  'TIME_SERIES_MONTHLY',
  'TIME_SERIES_WEEKLY',
  'TIME_SERIES_DAILY',
  'TIME_SERIES_INTRADAY',
];

export default interface IAction<T> {
  type: string;
  payload?: T;
}
