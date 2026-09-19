import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import type { Cargo } from "../../types";
import type { RootState } from "../../app/store";

interface CargosState {
  list: Cargo[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CargosState = {
  list: [],
  status: "idle",
  error: null,
};

export const fetchCargos = createAsyncThunk<Cargo[]>(
  "cargos/fetchCargos",
  async () => {
    const { data } = await api.get<Cargo[]>("/cargos");
    return data;
  }
);

const cargosSlice = createSlice({
  name: "cargos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCargos.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCargos.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchCargos.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Erro ao carregar cargos";
      });
  },
});

export const selectCargos = (state: RootState) => state.cargos.list;

// Resolve o nome de um cargo pelo id; se ainda não carregou (ou o id não
// existir mais), cai de volta no próprio id para nunca renderizar vazio.
export const selectCargoNome = (cargoId: string) => (state: RootState) =>
  state.cargos.list.find((c) => c.id === cargoId)?.nome ?? cargoId;

export default cargosSlice.reducer;
