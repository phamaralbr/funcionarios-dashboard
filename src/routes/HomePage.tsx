import { StepperEtapas } from "../features/etapas/StepperEtapas";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
    etapaAnterior,
    proximaEtapa,
    selectEtapaAtual,
    selectEtapaConcluida,
    TOTAL_ETAPAS,
} from "../features/etapas/etapasSlice";
import { EtapaConcluidaToggle } from "../features/etapas/EtapaConcluidaToggle";
import { FuncionarioResumo } from "../features/funcionario/FuncionarioResumo";
import { FuncionarioPainel } from "../features/funcionario/FuncionarioPainel";
import { EmBreve } from "../components/common/EmBreve";
import "./HomePage.css";

export function HomePage() {
    const dispatch = useAppDispatch();
    const etapaAtual = useAppSelector(selectEtapaAtual);
    const concluida = useAppSelector(selectEtapaConcluida(etapaAtual));

    const isPrimeiraEtapa = etapaAtual === 1;
    const isUltimaEtapa = etapaAtual === TOTAL_ETAPAS;
    // O botão "Próximo passo" só habilita quando a etapa atual está marcada
    // como concluída — vale igual para todas as 9 etapas, o que permite
    // testar a navegação completa do stepper.
    const proximoHabilitado = concluida;

    return (
        <div className="home-page">
            <StepperEtapas />

            <div className="home-page__conteudo">
                {etapaAtual === 1 ? (
                    <div className="home-page__grid">
                        <FuncionarioResumo />
                        <FuncionarioPainel />
                    </div>
                ) : (
                    <div className="home-page__placeholder">
                        <EmBreve />
                        <div className="home-page__placeholder-conclusao">
                            <EtapaConcluidaToggle etapa={etapaAtual} />
                        </div>
                    </div>
                )}
            </div>

            <div
                className={
                    "home-page__navegacao" +
                    (isPrimeiraEtapa
                        ? " home-page__navegacao--sem-anterior"
                        : "")
                }
            >
                {!isPrimeiraEtapa && (
                    <button
                        type="button"
                        className="btn btn--prev"
                        onClick={() => dispatch(etapaAnterior())}
                    >
                        Passo anterior
                    </button>
                )}
                <button
                    type="button"
                    className="btn btn--next"
                    disabled={!proximoHabilitado || isUltimaEtapa}
                    onClick={() => dispatch(proximaEtapa())}
                >
                    Próximo passo
                </button>
            </div>
        </div>
    );
}
