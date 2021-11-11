import { GET_HISTORY_DONE, HISTORY_ERROR } from '../actions/monitor/types';
import { MonitorReducerState } from '../types/ReducerTypes';

const initialState: MonitorReducerState = {
  tickerData: {},
  error: false,
  errorMessage: '',
};

const MonitorReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_HISTORY_DONE:
      return {
        error: false,
        errorMessage: '',
        tickerData: action.payload,
      };
    case HISTORY_ERROR: 
      return {
        error: true,
        errorMessage: action.payload,
        tickerData: {},
      }
    default:
      return state;
  }
}

export default MonitorReducer;
