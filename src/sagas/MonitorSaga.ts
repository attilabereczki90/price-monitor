import IAction, { SearchDetails } from '../types/ActionTypes';
import { call, put, takeEvery } from 'redux-saga/effects';
import { GET_HISTORY, GET_HISTORY_DONE, HISTORY_ERROR } from '../actions/monitor/types';
import { LOADING } from '../actions/app/types';

const baseURL = 'https://www.alphavantage.co/query?';
function fetchApi(url: string) {
  return fetch(url, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      }
  }).then(response => response.json())
    .catch((error) => {throw error})
}

export function* getHistory(action: IAction<SearchDetails>) {
  try {
    if(action.payload) {
      const { securityTicker, timeSeries } = action.payload;
      const timeFilter = `function=${timeSeries}`;
      const symbol = `symbol=${securityTicker}`;
      const interval =
        timeSeries === 'TIME_SERIES_INTRADAY' ? '&interval=5min' : '';
      const apiKey = `apikey=TEASHDO9G1ZV6SG3`;
      const endPoint = baseURL + [timeFilter, symbol, interval, apiKey].join("&");

      yield put({ type: LOADING, payload: true });
      const data: unknown = yield call(fetchApi, endPoint);
      if(data && typeof data === 'object' ) {
        if(data.hasOwnProperty('Error Message')) {
          yield put({ type: HISTORY_ERROR, payload: (data as any)['Error Message'] });
        } else if(data.hasOwnProperty('Note')) {
          yield put({ type: HISTORY_ERROR, payload: (data as any)['Note'] });
        } else {
          yield put({ type: GET_HISTORY_DONE, payload: data});
        }
      }
      
      yield put({ type: LOADING, payload: false });
    }
  } catch (error) {
      yield put({ type: HISTORY_ERROR, payload: (error as Error).message });
  }
}

function* monitorSaga() {
  yield takeEvery(GET_HISTORY, getHistory);
}

export default monitorSaga;