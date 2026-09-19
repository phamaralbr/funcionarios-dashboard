import {
    BellFilled,
    CameraFilled,
    CarFilled,
    CheckCircleFilled,
    CreditCardFilled,
    FileTextFilled,
    IdcardFilled,
    SettingFilled,
    ToolFilled,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
    irParaEtapa,
    selectConcluidas,
    selectEtapaAtual,
    TOTAL_ETAPAS,
} from "./etapasSlice";
import "./StepperEtapas.css";

const NOMES_ETAPAS = [
    "Item 1",
    "Item 2",
    "Item 3",
    "Item 4",
    "Item 5",
    "Item 6",
    "Item 7",
    "Item 8",
    "Item 9",
];

const ETAPA_ICONS = [
    <FileTextFilled key="icon-1" />,
    <CameraFilled key="icon-2" />,
    <SettingFilled key="icon-3" />,
    <CarFilled key="icon-4" />,
    <CreditCardFilled key="icon-5" />,
    <BellFilled key="icon-6" />,
    <IdcardFilled key="icon-7" />,
    <ToolFilled key="icon-8" />,
    <CheckCircleFilled key="icon-9" />,
];

export function StepperEtapas() {
    const dispatch = useAppDispatch();
    const etapaAtual = useAppSelector(selectEtapaAtual);
    const concluidas = useAppSelector(selectConcluidas);

    // "Fronteira" alcançável: a primeira etapa ainda não concluída, na ordem.
    // Só é possível avançar até ela — etapas depois disso exigem concluir as
    // anteriores primeiro. Voltar para qualquer etapa já visitada é sempre livre.
    let etapaFronteira = TOTAL_ETAPAS;
    for (let n = 1; n <= TOTAL_ETAPAS; n++) {
        if (!concluidas[n]) {
            etapaFronteira = n;
            break;
        }
    }

    return (
        <div className="stepper">
            {Array.from({ length: TOTAL_ETAPAS }, (_, i) => i + 1).map(
                (numero, idx) => {
                    const estaConcluida = Boolean(concluidas[numero]);
                    // "acessado" = já passou por essa etapa ou está nela agora
                    const foiAcessada = numero <= etapaAtual || estaConcluida;
                    const estaAtiva = numero === etapaAtual;
                    // Só navega para trás livremente, ou para frente até a fronteira alcançável
                    const podeNavegar =
                        numero <= etapaAtual || numero <= etapaFronteira;

                    return (
                        <div className="stepper__item-wrapper" key={numero}>
                            <button
                                type="button"
                                className={
                                    "stepper__item" +
                                    (foiAcessada
                                        ? " stepper__item--azul"
                                        : " stepper__item--cinza") +
                                    (estaAtiva ? " stepper__item--ativa" : "")
                                }
                                onClick={() => {
                                    if (podeNavegar)
                                        dispatch(irParaEtapa(numero));
                                }}
                                disabled={!podeNavegar}
                                aria-disabled={!podeNavegar}
                                aria-current={estaAtiva ? "step" : undefined}
                            >
                                <span className="stepper__circulo">
                                    {ETAPA_ICONS[idx]}
                                </span>
                                <span className="stepper__label">
                                    {NOMES_ETAPAS[idx]}
                                </span>
                                {estaConcluida && (
                                    <span className="stepper__concluido">
                                        Concluído
                                    </span>
                                )}
                            </button>
                            {numero < TOTAL_ETAPAS && (
                                <div className="stepper__linha" />
                            )}
                        </div>
                    );
                },
            )}
        </div>
    );
}
