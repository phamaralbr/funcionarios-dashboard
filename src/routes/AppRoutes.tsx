import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { HomePage } from "./HomePage";
import { MenuEmBrevePage } from "./MenuEmBrevePage";

export function AppRoutes() {
    return (
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />
                {/* Demais itens do menu lateral: todos apontam para o placeholder "Em breve" */}
                <Route path="/funcionarios" element={<MenuEmBrevePage />} />
                <Route path="/relatorios" element={<MenuEmBrevePage />} />
                <Route path="/indicadores" element={<MenuEmBrevePage />} />
                <Route path="/notificacoes" element={<MenuEmBrevePage />} />
                <Route path="/configuracoes" element={<MenuEmBrevePage />} />
                {/* Fallback */}
                <Route path="*" element={<MenuEmBrevePage />} />
            </Route>
        </Routes>
    );
}
