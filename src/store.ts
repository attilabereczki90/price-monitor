import { applyMiddleware, createStore } from '@reduxjs/toolkit';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers/rootReducer';
import monitorSaga from './sagas/MonitorSaga';

const sagaMiddleware = createSagaMiddleware();
const logger = createLogger();

// create a redux store with our reducer above and middleware
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware, logger)),
);

sagaMiddleware.run(monitorSaga);

export default store;
