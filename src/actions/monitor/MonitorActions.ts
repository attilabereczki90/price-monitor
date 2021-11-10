import { DataDetails } from "../../types/ActionTypes";
import { GET_HISTORY, GET_HISTORY_DONE, HISTORY_ERROR } from "./types";

export const getHistory = (payload: DataDetails) => ({
    type: GET_HISTORY,
    payload,
});

export const getHistoryDone = (payload: any) => ({
  type: GET_HISTORY_DONE,
  payload,
});

export const getHistoryError = (payload: string) => ({
  type: HISTORY_ERROR,
  payload,
});