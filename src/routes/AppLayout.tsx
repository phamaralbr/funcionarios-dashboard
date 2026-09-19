import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/layout/Sidebar";
import "./AppLayout.css";

export function AppLayout() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-layout__conteudo">
        <Outlet />
      </main>
    </div>
  );
}
