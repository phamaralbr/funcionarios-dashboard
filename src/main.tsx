import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import ptBR from "antd/locale/pt_BR";
import { store } from "./app/store";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={store}>
            <ConfigProvider
                locale={ptBR}
                theme={{
                    token: {
                        colorPrimary: "#649fbf",
                        borderRadius: 10,
                        fontFamily:
                            "'Ubuntu', -apple-system, BlinkMacSystemFont, sans-serif",
                    },
                    components: {
                        Switch: {
                            handleBg: "#649fbf",
                            handleSize: 16,
                            trackHeight: 20,
                        },
                    },
                }}
            >
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ConfigProvider>
        </Provider>
    </StrictMode>,
);
