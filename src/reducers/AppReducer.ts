import { LOADING } from '../actions/app/types';
import { AppReducerState } from '../types/ReducerTypes';

const initialState: AppReducerState = {
  isLoading: false,
};

const AppReducer = (state = initialState, action: any) => {
  switch(action.type) {
    case LOADING:
      return {
        isLoading: action.payload,
      };
    default:
      return state;
  }
}

export default AppReducer;
