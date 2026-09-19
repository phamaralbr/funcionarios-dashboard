import { useEffect } from "react";
import { Modal, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import "./ExclusaoConfirmadaModal.css";

interface Props {
    onClose: () => void;
    open?: boolean;
}

export function ExclusaoConfirmadaModal({ onClose, open = true }: Props) {
    // Fecha com Esc, mesma convenção de outros overlays da aplicação
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            closable={false}
            centered
            width={564}
            wrapClassName="exclusao-modal__wrapper"
        >
            <div
                className="exclusao-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <p
                    id="exclusao-modal-titulo"
                    className="exclusao-modal__titulo"
                >
                    Usuário excluído com sucesso!
                </p>

                <Button
                    type="text"
                    className="exclusao-modal__ok"
                    onClick={onClose}
                >
                    OK
                </Button>

                <button
                    type="button"
                    className="exclusao-modal__fechar"
                    aria-label="Fechar"
                    onClick={onClose}
                >
                    <CloseOutlined />
                </button>
            </div>
        </Modal>
    );
}
