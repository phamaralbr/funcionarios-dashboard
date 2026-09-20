import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";
import ptBR from "antd/locale/pt_BR";
import { store } from "./app/store";
import "./index.css";
import App from "./App.tsx";

// Captured at module-evaluation time: since this file is bundled as a
// classic IIFE <script> (not an ES module), document.currentScript
// correctly points at the tag that's executing us right now. Used to
// locate style.css, which sits next to index.js in the deployed assets.
const currentScriptSrc = (document.currentScript as HTMLScriptElement | null)?.src;
const assetsBaseUrl = currentScriptSrc
  ? currentScriptSrc.replace(/\/[^/]*$/, "")
  : "";

/**
 * Custom Element that Liferay mounts on the page as
 * <funcionarios-dashboard></funcionarios-dashboard>.
 *
 * Mounts into a shadow root so this widget's CSS is fully isolated from
 * Liferay's own page theme (and vice versa): Liferay's Lexicon/Clay styles
 * can no longer bleed into unset properties here, and antd's injected
 * styles (normally targeting document.head) are redirected into the
 * shadow root via @ant-design/cssinjs' StyleProvider.
 */
class FuncionariosDashboardElement extends HTMLElement {
  private root: ReturnType<typeof createRoot> | null = null;

  connectedCallback() {
    if (this.root) {
      // connectedCallback can fire again (e.g. Liferay reattaching the
      // element during page navigation) without a matching disconnect
      // first in some cases; guard so we never mount twice.
      return;
    }

    const shadow = this.shadowRoot ?? this.attachShadow({ mode: "open" });

    if (assetsBaseUrl) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `${assetsBaseUrl}/style.css`;
      shadow.appendChild(link);
    }

    // Liferay passes this attribute so routes inside the app stay under
    // the widget's own friendly URL instead of colliding with the page URL.
    const friendlyUrlMapping = this.getAttribute("friendly-url-mapping");
    const basename = friendlyUrlMapping ? `/-/${friendlyUrlMapping}` : "/";

    const mountPoint = document.createElement("div");
    shadow.appendChild(mountPoint);

    this.root = createRoot(mountPoint);
    this.root.render(
      <StrictMode>
        <StyleProvider container={shadow}>
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
              <BrowserRouter basename={basename}>
                <App />
              </BrowserRouter>
            </ConfigProvider>
          </Provider>
        </StyleProvider>
      </StrictMode>
    );
  }

  disconnectedCallback() {
    this.root?.unmount();
    this.root = null;
    if (this.shadowRoot) {
      this.shadowRoot.replaceChildren();
    }
  }
}

if (!customElements.get("funcionarios-dashboard")) {
  customElements.define("funcionarios-dashboard", FuncionariosDashboardElement);
}
