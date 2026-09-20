# Desafio Frontend

Implementação do desafio prático de recrutamento - página de gestão de etapas e funcionários.

## Stack

- **React 19** + **TypeScript** + **Vite**
- **Redux** - estado global
- **React Router** - roteamento (menu lateral e etapas)
- **Ant Design** - biblioteca de componentes/estilos
- **Axios** - cliente HTTP
- **json-server** - mock do back-end

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

    Se preferir rodar separadamente, use dois terminais com `npm run dev` e `npm run mock-server`.

## Integração com Liferay

### Build

```bash
npm run build:ce   # faz build do widget dentro de funcionarios-liferay-widget/
```

### Rodando o Liferay CE localmente

```bash
cd liferay-docker
docker compose up
```

(Liferay fica disponível em `http://localhost:8080`)

### Em outro diretório, crie o workspace de exemplo do Liferay

```bash
curl -o com.liferay.sample.workspace-latest.zip "https://repository.liferay.com/nexus/service/local/artifact/maven/content?r=liferay-public-releases&g=com.liferay.workspace&a=com.liferay.sample.workspace&v=LATEST&p=zip"
unzip com.liferay.sample.workspace-latest.zip
chmod +x gradlew
```

### Copie `funcionarios-liferay-widget/` deste repositório para `client-extensions/` do Liferay

### Deploy

```bash
cd client-extensions/funcionarios-dashboard-ce
../../gradlew clean deploy -Ddeploy.docker.container.id=$(docker ps -lq)
```

Depois do deploy, adicione o widget **Funcionarios Dashboard** pelo editor de páginas do Liferay em Widgets → Client Extensions.

- O widget continua consumindo a API mock local — rode `npm run mock-server` junto com o Liferay, senão ele vai renderizar sem dados.
