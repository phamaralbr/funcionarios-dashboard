import { configureStore } from "@reduxjs/toolkit";
import funcionarioReducer from "../features/funcionario/funcionarioSlice";
import etapasReducer from "../features/etapas/etapasSlice";
import cargosReducer from "../features/cargos/cargosSlice";
import atividadesReducer from "../features/atividades/atividadesSlice";
import episReducer from "../features/epis/episSlice";

export const store = configureStore({
  reducer: {
    funcionario: funcionarioReducer,
    etapas: etapasReducer,
    cargos: cargosReducer,
    atividades: atividadesReducer,
    epis: episReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
