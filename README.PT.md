# FPScoreBoard

Frontend para visualização de estatísticas do MatchZy para CS2.

## Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd FPScoreBoard
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse no navegador: `http://localhost:3000`

## Configuração

Após instalar, você precisa configurar a conexão com os dados. Existen duas opções:

### Opção 1: Arquivo .env

Crie um arquivo `.env` baseado no `.env.example` e preencha com os dados do seu banco de dados MySQL ou com os endpoints da API.

### Opção 2: Página de Configuração

Acesse a página de configuração em `/start-config` e preencha as informações solicitadas:

- **Linguagem**: Selecione entre Português, Inglês ou Espanhol
- **Fonte de Dados**: Escolha entre MySQL ou API
  - Se MySQL: Preencha os dados do banco (host, porta, usuário, senha, nome do banco)
  - Se API: Preencha a URL base da API e os endpoints

## Prioridade de Configuração

Para dados de API e banco de dados, o arquivo `.env` sempre tem prioridade sobre o `config.json`.

Para a flag `needConfig` (que controla se o link de configuração aparece no menu), o `config.json` tem prioridade sobre o `.env`.

## Uso

Após configurar corretamente, você pode acessar as seguintes páginas:

- `/` - Página inicial
- `/dashboard/matchs-stats` - Estatísticas de partidas
- `/dashboard/players-matchs` - Jogadores e suas partidas
- `/dashboard/maps-stats` - Estatísticas de mapas

O link "Config" aparece no menu apenas quando a configuração ainda não foi concluída.