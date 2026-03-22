# 🏗️ Arquitetura de Deploy

Visão geral de como o sistema funciona em produção.

## 📊 Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                         USUÁRIO                              │
│                    (Navegador Web)                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  FRONTEND (GitHub Pages)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React + TypeScript + Vite                           │  │
│  │  - MapComponent (Leaflet)                            │  │
│  │  - DashboardComponent                                │  │
│  │  - EventTableComponent                               │  │
│  │  - ReportFormModal                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  URL: https://seu-usuario.github.io                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS (API Calls)
                     │ GET /api/events
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 BACKEND (Render.com)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Node.js + Express + TypeScript                      │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │  Express Server                              │    │  │
│  │  │  - CORS Middleware                           │    │  │
│  │  │  - Rate Limiting (60 req/min)                │    │  │
│  │  │  - Security Headers                          │    │  │
│  │  │  - JSON Parser                               │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │  Cache Manager                               │    │  │
│  │  │  - In-Memory Cache                           │    │  │
│  │  │  - TTL: 5 minutos (configurável)             │    │  │
│  │  │  - Fallback em caso de erro                  │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │  Scraper Service (Playwright)                │    │  │
│  │  │  - Chromium Headless                         │    │  │
│  │  │  - DOM Extraction                            │    │  │
│  │  │  - Timeout: 30s (configurável)               │    │  │
│  │  │  - Single scraping constraint                │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │  Data Transformer                            │    │  │
│  │  │  - Validação de dados                        │    │  │
│  │  │  - Geração de IDs (MD5)                      │    │  │
│  │  │  - Conversão de coordenadas                  │    │  │
│  │  │  - Formatação ISO 8601                       │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  │                                                       │  │
│  │  ┌─────────────────────────────────────────────┐    │  │
│  │  │  Logger                                      │    │  │
│  │  │  - Structured JSON logs                      │    │  │
│  │  │  - Timestamps ISO 8601                       │    │  │
│  │  │  - Configurable levels                       │    │  │
│  │  └─────────────────────────────────────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  URL: https://powerbi-scraper-backend.onrender.com          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTPS (Web Scraping)
                     │ Playwright
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              POWER BI DASHBOARD (Fonte de Dados)            │
│                                                              │
│  URL: https://estradasbloqueadas.com.br                     │
│                                                              │
│  Dados extraídos:                                            │
│  - Cidade                                                    │
│  - UF                                                        │
│  - Local                                                     │
│  - Observação                                                │
│  - Latitude                                                  │
│  - Longitude                                                 │
│  - Data de Atualização                                       │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Fluxo de Dados

### 1. Usuário Acessa o Site

```
Usuário → Frontend (GitHub Pages)
```

- Frontend carrega no navegador
- React renderiza componentes
- Mapa inicializa (Leaflet + OpenStreetMap)

### 2. Frontend Solicita Dados

```
Frontend → Backend (Render.com)
GET /api/events
```

- APIService faz requisição HTTP
- Headers incluem CORS
- Timeout: 30 segundos

### 3. Backend Verifica Cache

```
Backend → Cache Manager
```

**Se cache válido (< 5 min):**
```
Cache Manager → Backend → Frontend
✅ Retorna dados do cache (rápido: ~100ms)
```

**Se cache expirado ou inexistente:**
```
Backend → Scraper Service
```

### 4. Scraper Extrai Dados

```
Scraper → Power BI Dashboard
```

1. Playwright abre Chromium headless
2. Navega para URL do Power BI
3. Aguarda renderização (networkidle)
4. Aguarda seletor `.visual-container`
5. Extrai dados do DOM com `page.evaluate()`
6. Fecha página (mantém navegador)

**Duração:** ~10-30 segundos

### 5. Dados São Transformados

```
Scraper → Data Transformer
```

1. Valida campos obrigatórios
2. Converte coordenadas (string → number)
3. Valida limites do Brasil
4. Valida formato UF (2 chars)
5. Converte data para ISO 8601
6. Gera ID único (MD5 de cidade-uf-lat-lng)
7. Filtra eventos inválidos

### 6. Cache É Atualizado

```
Data Transformer → Cache Manager → Backend
```

- Dados válidos são armazenados
- Timestamp é registrado
- TTL de 5 minutos é aplicado

### 7. Resposta ao Frontend

```
Backend → Frontend
```

**Resposta JSON:**
```json
[
  {
    "id": "abc123...",
    "cidade": "São Paulo",
    "uf": "SP",
    "local": "Rodovia BR-101",
    "observacao": "Interdição parcial",
    "latitude": -23.5505,
    "longitude": -46.6333,
    "dataAtualizacao": "2024-03-20T10:30:00.000Z"
  }
]
```

### 8. Frontend Renderiza

```
Frontend → Componentes React
```

1. EventContext recebe dados
2. MapComponent plota marcadores
3. DashboardComponent mostra estatísticas
4. EventTableComponent lista eventos
5. LoadingIndicator desaparece

## ⚡ Cenários de Uso

### Cenário 1: Cache Hit (Comum)

```
Usuário → Frontend → Backend → Cache → Frontend
Tempo: ~200-500ms
```

- Cache válido
- Resposta instantânea
- Sem scraping

### Cenário 2: Cache Miss (Primeira Requisição)

```
Usuário → Frontend → Backend → Scraper → Power BI → Transformer → Cache → Frontend
Tempo: ~10-30 segundos
```

- Cache vazio ou expirado
- Scraping necessário
- Dados atualizados

### Cenário 3: Scraping Falha (Fallback)

```
Usuário → Frontend → Backend → Scraper (ERRO) → Cache (expirado) → Frontend
Tempo: ~5-10 segundos
```

- Scraping falha (timeout, erro de rede, etc)
- Backend retorna cache expirado
- Dados podem estar desatualizados, mas sistema continua funcionando
- Status 200 (não é erro para o usuário)

### Cenário 4: Cold Start (Render Free Plan)

```
Usuário → Frontend → Backend (DORMINDO) → Wake Up → Scraper → Frontend
Tempo: ~30-60 segundos (primeira requisição)
```

- Backend dormiu após 15 min de inatividade
- Render acorda o serviço
- Scraping acontece
- Requisições seguintes são rápidas

## 🔐 Segurança

### CORS (Cross-Origin Resource Sharing)

```
Frontend (github.io) → Backend (render.com)
```

- Backend valida origem da requisição
- Apenas origens em `ALLOWED_ORIGINS` são permitidas
- Previne acesso não autorizado

### Rate Limiting

```
60 requisições por minuto por IP
```

- Previne abuso
- Protege contra DDoS simples
- Configurável

### Headers de Segurança

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
```

- Previne ataques XSS
- Previne clickjacking

## 📊 Monitoramento

### Logs Estruturados

```json
{
  "level": "info",
  "timestamp": "2024-03-20T10:30:00.000Z",
  "message": "Scraping completed",
  "metadata": {
    "duration": 15234,
    "eventsCount": 42
  }
}
```

### Métricas do Render

- CPU usage
- Memory usage
- Response time
- Request count
- Error rate

## 🚨 Tratamento de Erros

### Erro no Scraping

```
Scraper (ERRO) → Logger → Cache (fallback) → Frontend
```

- Erro é logado
- Cache expirado é usado como fallback
- Sistema continua funcionando
- Status 200 (graceful degradation)

### Erro no Frontend

```
Frontend (ERRO) → ErrorBoundary → Mensagem ao usuário
```

- React ErrorBoundary captura erros
- Mensagem amigável ao usuário
- Sistema não quebra completamente

## 💰 Custos

### GitHub Pages
- **Custo:** $0/mês
- **Bandwidth:** 100 GB/mês
- **Build time:** Ilimitado

### Render.com (Free Plan)
- **Custo:** $0/mês
- **Horas:** 750h/mês (suficiente para 24/7)
- **RAM:** 512 MB
- **Bandwidth:** 100 GB/mês
- **Limitação:** Sleep após 15 min de inatividade

### Total
- **Custo mensal:** $0 💰
- **Custo anual:** $0 💰

## 🔄 Deploy Automático

### Frontend (GitHub Pages)

```
git push → GitHub Actions → Build → Deploy → Live
Tempo: ~2-3 minutos
```

### Backend (Render.com)

```
git push → Render Webhook → Build → Deploy → Live
Tempo: ~5-10 minutos
```

## 📈 Escalabilidade

### Limites Atuais (Free Plan)

- **Usuários simultâneos:** ~50-100
- **Requisições/min:** 60 por IP
- **Cache:** In-memory (perde ao reiniciar)
- **Scraping:** 1 por vez

### Upgrade Path

**Se precisar escalar:**

1. **Render Starter ($7/mês)**
   - Sem sleep
   - Mais RAM (512 MB → 2 GB)
   - Mais CPU

2. **Redis Cache (Externo)**
   - Cache persistente
   - Compartilhado entre instâncias
   - Upstash (free tier disponível)

3. **Load Balancer**
   - Múltiplas instâncias do backend
   - Distribuição de carga

4. **CDN**
   - Cloudflare (gratuito)
   - Cache de assets
   - DDoS protection

## 🎯 Próximos Passos

1. ✅ Deploy do backend no Render
2. ✅ Deploy do frontend no GitHub Pages
3. 🔄 Configurar keep-alive (UptimeRobot)
4. 🔄 Adicionar monitoramento (opcional)
5. 🔄 Domínio customizado (opcional)

---

**Dúvidas?** Consulte os guias específicos:
- [DEPLOY-RENDER.md](DEPLOY-RENDER.md) - Deploy do backend
- [DEPLOY.md](DEPLOY.md) - Deploy do frontend
- [RENDER-TIPS.md](RENDER-TIPS.md) - Dicas e otimizações
