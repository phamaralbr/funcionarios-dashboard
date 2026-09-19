# Desafio Frontend

Implementação do desafio prático de recrutamento — página de gestão de etapas e funcionários.

## Stack

- **React 19** + **TypeScript** + **Vite**
- **Redux** — estado global
- **React Router** — roteamento (menu lateral e etapas)
- **Ant Design** — biblioteca de componentes/estilos
- **Axios** — cliente HTTP
- **json-server** — mock do back-end

## Como rodar

1. Instale as dependências:

    ```bash
    npm install
    ```

2. Copie o `.env.example` para `.env` (opcional, já tem um valor padrão):

    ```bash
    cp .env.example .env
    ```

3. Suba o front-end **e** o json-server juntos:

    ```bash
    npm run start
    ```

    Isso roda em paralelo:
    - `npm run dev` → app React em `http://localhost:5173`
    - `npm run mock-server` → API mock em `http://localhost:3001`

    Se preferir rodar separadamente, use dois terminais com `npm run dev` e `npm run mock-server`.
