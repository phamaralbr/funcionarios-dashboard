import {
    TeamOutlined,
    BellOutlined,
    EditOutlined,
    UserOutlined,
    UndoOutlined,
    ApartmentOutlined,
    FileTextOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

// Os 6 ícones/funcionalidades do menu lateral.
// Apenas "home" tem tela real implementada; o restante cai em /em-breve.
const ITENS_MENU = [
    {
        key: "funcionarios",
        path: "/funcionarios",
        icon: <TeamOutlined />,
        label: "Funcionários",
    },
    { key: "home", path: "/", icon: <EditOutlined />, label: "Início" },
    {
        key: "relatorios",
        path: "/relatorios",
        icon: <ApartmentOutlined />,
        label: "Relatórios",
    },
    {
        key: "notificacoes",
        path: "/notificacoes",
        icon: <BellOutlined />,
        label: "Notificações",
    },
    {
        key: "indicadores",
        path: "/indicadores",
        icon: <UndoOutlined />,
        label: "Indicadores",
    },
    {
        key: "configuracoes",
        path: "/configuracoes",
        icon: <UserOutlined />,
        label: "Configurações",
    },
];

export function Sidebar() {
    return (
        <nav className="sidebar" aria-label="Menu principal">
            {ITENS_MENU.map((item) => (
                <span key={item.key} style={{ position: "relative" }}>
                    <NavLink
                        to={item.path}
                        title={item.label}
                        end={item.path === "/"}
                        className={({ isActive }) =>
                            "sidebar__item" +
                            (isActive ? " sidebar__item--active" : "")
                        }
                    >
                        <span>{item.icon}</span>
                    </NavLink>
                    {item.key == "notificacoes" && (
                        <span className="sidebar__badge">
                            <FileTextOutlined />
                        </span>
                    )}
                </span>
            ))}
        </nav>
    );
}
