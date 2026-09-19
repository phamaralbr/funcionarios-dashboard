import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import type { Atividade } from "../../types";
import type { RootState } from "../../app/store";

interface AtividadesState {
  list: Atividade[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: AtividadesState = {
  list: [],
  status: "idle",
  error: null,
};

export const fetchAtividades = createAsyncThunk<Atividade[]>(
  "atividades/fetchAtividades",
  async () => {
    const { data } = await api.get<Atividade[]>("/atividades");
    return data;
  }
);

const atividadesSlice = createSlice({
  name: "atividades",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAtividades.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAtividades.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchAtividades.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? "Erro ao carregar atividades";
      });
  },
});

export const selectAtividadesOpcoes = (state: RootState) => state.atividades.list;

export default atividadesSlice.reducer;
