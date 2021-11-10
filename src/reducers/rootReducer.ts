import { combineReducers, ReducersMapObject } from "@reduxjs/toolkit";
import { Reducer } from "redux";
import AppReducer from "./AppReducer";
import MonitorReducer from "./MonitorReducer";

const reducerMap: ReducersMapObject = {
  monitor: MonitorReducer,
  app: AppReducer,
};

export default combineReducers(reducerMap) as Reducer<{}>;