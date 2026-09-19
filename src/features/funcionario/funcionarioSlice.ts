import {
    createAsyncThunk,
    createSelector,
    createSlice,
    type PayloadAction,
} from "@reduxjs/toolkit";
import { api } from "../../services/api";
import type { Funcionario, FuncionarioInput } from "../../types";
import type { RootState } from "../../app/store";

export type VisualizacaoPainel = "lista" | "formulario";

interface FuncionarioState {
    list: Funcionario[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
    filtroApenasAtivos: boolean;
    visualizacao: VisualizacaoPainel;
    funcionarioEmEdicao: Funcionario | null;
}

const initialState: FuncionarioState = {
    list: [],
    status: "idle",
    error: null,
    filtroApenasAtivos: false,
    visualizacao: "lista",
    funcionarioEmEdicao: null,
};

// ---- Thunks assíncronos (comunicação com o json-server) ----

export const fetchFuncionarios = createAsyncThunk<Funcionario[]>(
    "funcionario/fetchFuncionarios",
    async () => {
        const { data } = await api.get<Funcionario[]>("/funcionarios");
        return data;
    },
);

export const criarFuncionario = createAsyncThunk<Funcionario, FuncionarioInput>(
    "funcionario/criarFuncionario",
    async (payload) => {
        const { data } = await api.post<Funcionario>("/funcionarios", payload);
        return data;
    },
);

export const atualizarFuncionario = createAsyncThunk<Funcionario, Funcionario>(
    "funcionario/atualizarFuncionario",
    async (payload) => {
        const { data } = await api.put<Funcionario>(
            `/funcionarios/${payload.id}`,
            payload,
        );
        return data;
    },
);

export const excluirFuncionario = createAsyncThunk<string, string>(
    "funcionario/excluirFuncionario",
    async (id) => {
        await api.delete(`/funcionarios/${id}`);
        return id;
    },
);

const funcionarioSlice = createSlice({
    name: "funcionario",
    initialState,
    reducers: {
        alternarFiltroAtivos: (state) => {
            state.filtroApenasAtivos = !state.filtroApenasAtivos;
        },
        limparFiltros: (state) => {
            state.filtroApenasAtivos = false;
        },
        abrirFormularioNovo: (state) => {
            state.funcionarioEmEdicao = null;
            state.visualizacao = "formulario";
        },
        abrirFormularioEdicao: (state, action: PayloadAction<Funcionario>) => {
            state.funcionarioEmEdicao = action.payload;
            state.visualizacao = "formulario";
        },
        fecharFormulario: (state) => {
            state.visualizacao = "lista";
            state.funcionarioEmEdicao = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetch
            .addCase(fetchFuncionarios.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchFuncionarios.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.list = action.payload;
            })
            .addCase(fetchFuncionarios.rejected, (state, action) => {
                state.status = "failed";
                state.error =
                    action.error.message ?? "Erro ao carregar funcionários";
            })
            // criar
            .addCase(criarFuncionario.fulfilled, (state, action) => {
                state.list.push(action.payload);
                state.visualizacao = "lista";
            })
            // atualizar
            .addCase(atualizarFuncionario.fulfilled, (state, action) => {
                const idx = state.list.findIndex(
                    (f) => f.id === action.payload.id,
                );
                if (idx !== -1) state.list[idx] = action.payload;
                state.visualizacao = "lista";
                state.funcionarioEmEdicao = null;
            })
            // excluir
            .addCase(excluirFuncionario.fulfilled, (state, action) => {
                state.list = state.list.filter((f) => f.id !== action.payload);
            });
    },
});

export const {
    alternarFiltroAtivos,
    limparFiltros,
    abrirFormularioNovo,
    abrirFormularioEdicao,
    fecharFormulario,
} = funcionarioSlice.actions;

// ---- Selectors ----

export const selectFuncionarios = (state: RootState) => state.funcionario.list;
export const selectFuncionarioStatus = (state: RootState) =>
    state.funcionario.status;
export const selectFiltroApenasAtivos = (state: RootState) =>
    state.funcionario.filtroApenasAtivos;
export const selectVisualizacao = (state: RootState) =>
    state.funcionario.visualizacao;
export const selectFuncionarioEmEdicao = (state: RootState) =>
    state.funcionario.funcionarioEmEdicao;

export const selectFuncionariosFiltrados = (state: RootState) => {
    const { list, filtroApenasAtivos } = state.funcionario;
    return filtroApenasAtivos ? list.filter((f) => f.status === "ativo") : list;
};

// Use createSelector to memoize the object return and prevent unnecessary rerenders
export const selectContagemAtivos = createSelector(
    [(state: RootState) => state.funcionario.list],
    (list) => {
        const ativos = list.filter((f) => f.status === "ativo").length;
        return { ativos, total: list.length };
    },
);

export default funcionarioSlice.reducer;
