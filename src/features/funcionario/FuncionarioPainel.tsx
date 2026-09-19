import { useEffect, useState } from "react";
import { Button, Empty, Spin } from "antd";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    abrirFormularioEdicao,
    abrirFormularioNovo,
    alternarFiltroAtivos,
    excluirFuncionario,
    fecharFormulario,
    fetchFuncionarios,
    limparFiltros,
    selectContagemAtivos,
    selectFiltroApenasAtivos,
    selectFuncionarioEmEdicao,
    selectFuncionarioStatus,
    selectFuncionariosFiltrados,
    selectVisualizacao,
} from "./funcionarioSlice";
import { FuncionarioListItem } from "./FuncionarioListItem";
import { FuncionarioForm } from "./FuncionarioForm";
import { ExclusaoConfirmadaModal } from "./ExclusaoConfirmadaModal";
import { fetchCargos } from "../cargos/cargosSlice";
import { fetchAtividades } from "../atividades/atividadesSlice";
import { fetchEpis } from "../epis/episSlice";
import type { Funcionario } from "../../types";
import { selectEtapaAtual } from "../etapas/etapasSlice";
import { EtapaConcluidaToggle } from "../etapas/EtapaConcluidaToggle";
import "./FuncionarioPainel.css";

export function FuncionarioPainel() {
    const dispatch = useAppDispatch();
    const status = useAppSelector(selectFuncionarioStatus);
    const funcionarios = useAppSelector(selectFuncionariosFiltrados);
    const filtroApenasAtivos = useAppSelector(selectFiltroApenasAtivos);
    const { ativos, total } = useAppSelector(selectContagemAtivos);
    const visualizacao = useAppSelector(selectVisualizacao);
    const funcionarioEmEdicao = useAppSelector(selectFuncionarioEmEdicao);

    const etapaAtual = useAppSelector(selectEtapaAtual);

    const [exclusaoConfirmada, setExclusaoConfirmada] = useState(false);

    useEffect(() => {
        dispatch(fetchFuncionarios());
        dispatch(fetchCargos());
        dispatch(fetchAtividades());
        dispatch(fetchEpis());
    }, [dispatch]);

    const handleAlterar = (f: Funcionario) =>
        dispatch(abrirFormularioEdicao(f));

    const handleExcluir = async (f: Funcionario) => {
        try {
            await dispatch(excluirFuncionario(f.id)).unwrap();
            setExclusaoConfirmada(true);
        } catch {
            // erro de rede/API: já refletido em selectFuncionarioStatus/erro,
            // nenhuma ação extra necessária aqui além de não mostrar o sucesso.
        }
    };

    const formularioAberto = visualizacao === "formulario";

    return (
        <div className="painel-card">
            <header className="painel-card__header">
                {formularioAberto && (
                    <button
                        type="button"
                        className="painel-card__voltar"
                        aria-label="Voltar para a lista de funcionários"
                        onClick={() => dispatch(fecharFormulario())}
                    >
                        ←
                    </button>
                )}
                <h2 className="painel-card__titulo">
                    {formularioAberto
                        ? funcionarioEmEdicao
                            ? "Alterar Funcionário"
                            : "Adicionar Funcionário"
                        : "Funcionário(s)"}
                </h2>
            </header>

            {formularioAberto ? (
                <div className="painel-card__section painel-card__section--form">
                    <FuncionarioForm funcionario={funcionarioEmEdicao} />
                </div>
            ) : (
                <>
                    <div className="painel-card__section">
                        <Button
                            // type="button"
                            className="btn btn--add"
                            onClick={() => dispatch(abrirFormularioNovo())}
                        >
                            + Adicionar Funcionário
                        </Button>

                        <div className="painel-card__filtros">
                            <div className="painel-card__filtros-botoes">
                                <Button
                                    // type="button"
                                    className="btn btn--outline"
                                    aria-pressed={filtroApenasAtivos}
                                    onClick={() =>
                                        dispatch(alternarFiltroAtivos())
                                    }
                                >
                                    Ver apenas ativos
                                </Button>
                                <Button
                                    // type="button"
                                    className="btn btn--outline-muted"
                                    onClick={() => dispatch(limparFiltros())}
                                >
                                    Limpar filtros
                                </Button>
                            </div>
                            <span className="painel-card__contagem">
                                Ativos {ativos}/{total}
                            </span>
                        </div>
                    </div>

                    <div className="painel-card__section painel-card__section--lista">
                        <div className="painel-card__lista">
                            {status === "loading" ? (
                                <div className="painel-card__loading">
                                    <Spin />
                                </div>
                            ) : funcionarios.length === 0 ? (
                                <Empty description="Nenhum funcionário encontrado" />
                            ) : (
                                funcionarios.map((f) => (
                                    <FuncionarioListItem
                                        key={f.id}
                                        funcionario={f}
                                        onAlterar={handleAlterar}
                                        onExcluir={handleExcluir}
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    <div className="painel-card__section painel-card__footer-wrapper">
                        <div className="painel-card__conclusao">
                            <EtapaConcluidaToggle etapa={etapaAtual} />
                        </div>
                    </div>
                </>
            )}

            {exclusaoConfirmada && (
                <ExclusaoConfirmadaModal
                    onClose={() => setExclusaoConfirmada(false)}
                />
            )}
        </div>
    );
}
