import { useEffect, useState } from "react";
import { EllipsisOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../app/hooks";
import { selectCargoNome } from "../cargos/cargosSlice";
import type { Funcionario } from "../../types";
import "./FuncionarioListItem.css";

interface Props {
  funcionario: Funcionario;
  onAlterar: (f: Funcionario) => void;
  onExcluir: (f: Funcionario) => void;
}

export function FuncionarioListItem({ funcionario, onAlterar, onExcluir }: Props) {
  const [menuAberto, setMenuAberto] = useState(false);
  const cargoNome = useAppSelector(selectCargoNome(funcionario.cargoId));

  useEffect(() => {
    if (!menuAberto) return;
    const fechar = () => setMenuAberto(false);
    document.addEventListener("click", fechar);
    return () => document.removeEventListener("click", fechar);
  }, [menuAberto]);

  const handleAlterar = () => {
    setMenuAberto(false);
    onAlterar(funcionario);
  };

  const handleExcluir = () => {
    setMenuAberto(false);
    if (window.confirm(`Deseja realmente excluir ${funcionario.nomeCompleto}?`)) {
      onExcluir(funcionario);
    }
  };

  return (
    <div
      className={
        "func-item " +
        (funcionario.status === "ativo" ? "func-item--ativo" : "func-item--inativo")
      }
      data-testid="funcionario-item"
    >
      <div className="func-item__info">
        <p className="func-item__nome">{funcionario.nomeCompleto}</p>
        <div className="func-item__tags">
          <span className="tag">{funcionario.cpf}</span>
          <span className="tag">{funcionario.status === "ativo" ? "Ativo" : "Inativo"}</span>
          <span className="tag">{cargoNome}</span>
        </div>
      </div>

      <div className="func-item__actions-wrapper">
        <button
          type="button"
          className="func-item__actions"
          aria-haspopup="true"
          aria-expanded={menuAberto}
          aria-label={`Mais ações para ${funcionario.nomeCompleto}`}
          onClick={(e) => {
            e.stopPropagation();
            setMenuAberto((v) => !v);
          }}
        >
          <EllipsisOutlined />
        </button>

        {menuAberto && (
          <div className="func-item__menu">
            <button type="button" onClick={handleAlterar}>
              Alterar
            </button>
            <button type="button" onClick={handleExcluir}>
              Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
