import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import type { Epi } from "../../types";
import type { RootState } from "../../app/store";

interface EpisState {
  list: Epi[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: EpisState = {
  list: [],
  status: "idle",
  error: null,
};

export const fetchEpis = createAsyncThunk<Epi[]>("epis/fetchEpis", async () => {
  const { data } = await api.get<Epi[]>("/epis");
  return data;
});

const episSlice = createSlice({
  name: "epis",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEpis.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEpis.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchEpis.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Erro ao carregar EPIs";
      });
  },
});

export const selectEpisOpcoes = (state: RootState) => state.epis.list;

export default episSlice.reducer;
