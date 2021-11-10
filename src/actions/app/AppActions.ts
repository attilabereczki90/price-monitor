import { LOADING } from "./types"

export const setLoading = (payload: boolean) => ({
  type: LOADING,
  payload,
});
