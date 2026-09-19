import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export const TOTAL_ETAPAS = 9;

interface EtapasState {
  etapaAtual: number;
  // registra, por etapa, se o usuário marcou "a etapa está concluída"
  concluidas: Record<number, boolean>;
}

const initialState: EtapasState = {
  etapaAtual: 1,
  concluidas: {},
};

const etapasSlice = createSlice({
  name: "etapas",
  initialState,
  reducers: {
    irParaEtapa: (state, action: PayloadAction<number>) => {
      const etapa = action.payload;
      if (etapa >= 1 && etapa <= TOTAL_ETAPAS) {
        state.etapaAtual = etapa;
      }
    },
    proximaEtapa: (state) => {
      if (state.etapaAtual < TOTAL_ETAPAS) state.etapaAtual += 1;
    },
    etapaAnterior: (state) => {
      if (state.etapaAtual > 1) state.etapaAtual -= 1;
    },
    definirConclusao: (
      state,
      action: PayloadAction<{ etapa: number; concluida: boolean }>
    ) => {
      state.concluidas[action.payload.etapa] = action.payload.concluida;
    },
  },
});

export const { irParaEtapa, proximaEtapa, etapaAnterior, definirConclusao } =
  etapasSlice.actions;

export const selectEtapaAtual = (state: RootState) => state.etapas.etapaAtual;
export const selectConcluidas = (state: RootState) => state.etapas.concluidas;
export const selectEtapaConcluida = (etapa: number) => (state: RootState) =>
  Boolean(state.etapas.concluidas[etapa]);

export default etapasSlice.reducer;
