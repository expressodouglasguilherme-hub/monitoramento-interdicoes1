# Power BI Scraper Backend

Backend Node.js que extrai dados de um dashboard público do Power BI e expõe via API REST.

## Tecnologias

- Node.js 18+
- TypeScript
- Express
- Playwright (web scraping)
- Docker

## Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```bash
# Porta do servidor HTTP
PORT=3000

# URL do dashboard Power BI
POWERBI_URL=https://estradasbloqueadas.com.br

# Duração do cache em milissegundos (padrão: 5 minutos)
CACHE_DURATION_MS=300000

# Timeout de scraping em milissegundos (padrão: 30 segundos)
SCRAPING_TIMEOUT_MS=30000

# Origens permitidas para CORS (separadas por vírgula)
ALLOWED_ORIGINS=

# Nível de log: debug, info, warn, error
LOG_LEVEL=info
```

## Instalação

```bash
# Instalar dependências
npm install

# Instalar navegadores do Playwright
npx playwright install chromium
```

## Desenvolvimento

```bash
# Modo desenvolvimento com hot reload
npm run dev
```

## Build e Produção

```bash
# Build TypeScript
npm run build

# Executar em produção
npm start
```

## API Endpoints

### GET /api/events

Retorna lista de eventos de interdições.

**Resposta:**
```json
[
  {
    "id": "abc123",
    "cidade": "São Paulo",
    "uf": "SP",
    "local": "Rodovia BR-101",
    "observacao": "Interdição parcial devido a acidente",
    "latitude": -23.5505,
    "longitude": -46.6333,
    "dataAtualizacao": "2024-03-20T10:30:00.000Z"
  }
]
```

### GET /health

Healthcheck endpoint.

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2024-03-20T10:30:00.000Z"
}
```

## Deploy

### Opção 1: Render.com (Recomendado - Gratuito)

Veja o guia completo em [DEPLOY-RENDER.md](../DEPLOY-RENDER.md)

**Resumo rápido**:
1. Crie conta em https://render.com
2. Conecte seu repositório GitHub
3. Configure como Web Service
4. Use `backend` como Root Directory
5. Build Command: `npm install && npx playwright install --with-deps chromium && npm run build`
6. Start Command: `npm start`
7. Configure variáveis de ambiente

### Opção 2: Docker

#### Build da imagem

```bash
docker build -t powerbi-scraper-backend .
```

#### Executar container

```bash
docker run -d \
  -p 3000:3000 \
  -e POWERBI_URL=https://estradasbloqueadas.com.br \
  -e CACHE_DURATION_MS=300000 \
  --name powerbi-backend \
  powerbi-scraper-backend
```

#### Docker Compose

```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - POWERBI_URL=https://estradasbloqueadas.com.br
      - CACHE_DURATION_MS=300000
      - LOG_LEVEL=info
    restart: unless-stopped
```

## Notas Importantes

### Seletores do Power BI

Os seletores CSS usados para extrair dados do Power BI precisam ser ajustados conforme a estrutura real do dashboard. Use o Playwright Inspector para identificar os seletores corretos:

```bash
npx playwright codegen https://estradasbloqueadas.com.br
```

Edite o arquivo `src/services/scraper.ts` no método `extractEvents()` para ajustar os seletores.

## Arquitetura

- **Logger**: Sistema de logging estruturado em JSON
- **CacheManager**: Cache em memória com TTL configurável
- **DataTransformer**: Validação e transformação de dados
- **ScraperService**: Scraping com Playwright
- **Server**: API REST com Express

## Licença

MIT
