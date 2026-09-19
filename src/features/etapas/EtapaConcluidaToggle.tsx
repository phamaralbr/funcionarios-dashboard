import { Switch } from "antd";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { definirConclusao, selectEtapaConcluida } from "./etapasSlice";
import "./EtapaConcluidaToggle.css";

interface Props {
    etapa: number;
}

// Reutilizado tanto na etapa 1 (dentro do FuncionarioPainel) quanto nas
// demais etapas ("Em breve") — permite marcar qualquer etapa como concluída
// para testar a navegação do stepper de ponta a ponta.
export function EtapaConcluidaToggle({ etapa }: Props) {
    const dispatch = useAppDispatch();
    const concluida = useAppSelector(selectEtapaConcluida(etapa));

    return (
        <div className="switch">
            <span className="switch__label">A etapa está concluída?</span>
            <Switch
                checked={concluida}
                onChange={(checked: boolean) =>
                    dispatch(definirConclusao({ etapa, concluida: checked }))
                }
                checkedChildren="Sim"
                unCheckedChildren="Não"
                className="custom-switch"
            />
        </div>
    );
}
