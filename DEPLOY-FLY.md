# 🚀 Deploy no Fly.io - Guia Completo

Deploy do backend no Fly.io (gratuito, sempre ativo, suporta Playwright).

## Por que Fly.io?

- ✅ **Sempre ativo** (não dorme)
- ✅ **Gratuito** (3 VMs de 256 MB)
- ✅ **Suporta Playwright** perfeitamente
- ✅ **Deploy via CLI** (mais confiável)
- ✅ **Região Brasil** disponível (São Paulo)

---

## Pré-requisitos

Você precisa ter instalado:
- **Node.js** (para usar o flyctl)
- **Git** (opcional, mas recomendado)

---

## Passo 1: Instalar Fly CLI

### Windows (PowerShell como Administrador):

```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

### Ou via Chocolatey:

```powershell
choco install flyctl
```

### Verificar instalação:

```bash
flyctl version
```

---

## Passo 2: Criar Conta no Fly.io

```bash
flyctl auth signup
```

Ou se já tem conta:

```bash
flyctl auth login
```

**Importante**: Você vai precisar adicionar um cartão de crédito, mas **não será cobrado** no plano gratuito. É apenas para verificação.

---

## Passo 3: Preparar o Projeto

### 3.1 Fazer Upload do fly.toml para o GitHub

O arquivo `backend/fly.toml` já foi criado. Você precisa fazer commit dele:

1. No GitHub, vá no seu repositório
2. Navegue até `Interdições/backend/`
3. Clique em "Add file" → "Upload files"
4. Arraste o arquivo `fly.toml` (está na pasta `backend/` do seu projeto local)
5. Commit

### 3.2 Clonar o Repositório Localmente (se ainda não tem)

Se você não tem Git instalado, pule para a **Opção B** abaixo.

```bash
git clone https://github.com/seu-usuario/monitoramento-interdicoes.git
cd monitoramento-interdicoes/Interdições/backend
```

---

## Passo 4: Deploy no Fly.io

### Opção A: Com Git (Recomendado)

No terminal, dentro da pasta `Interdições/backend`:

```bash
# Criar app no Fly.io
flyctl launch --no-deploy

# Quando perguntar:
# - App name: powerbi-scraper-backend (ou deixe gerar automaticamente)
# - Region: gru (São Paulo, Brasil)
# - Would you like to set up a PostgreSQL database? NO
# - Would you like to set up an Upstash Redis database? NO
# - Would you like to deploy now? NO

# Configurar secrets (variáveis de ambiente sensíveis)
flyctl secrets set ALLOWED_ORIGINS="http://localhost:5173"

# Fazer deploy
flyctl deploy
```

### Opção B: Sem Git (Upload Manual)

Se você não tem Git instalado:

1. **Baixe o flyctl** (Passo 1)
2. **Faça login** (Passo 2)
3. **Crie o app manualmente**:

```bash
# No terminal, navegue até a pasta backend
cd "caminho/para/Interdições/backend"

# Crie o app
flyctl apps create powerbi-scraper-backend

# Configure
flyctl secrets set ALLOWED_ORIGINS="http://localhost:5173"

# Deploy
flyctl deploy
```

---

## Passo 5: Aguardar Deploy

O deploy vai demorar ~5-10 minutos. Você vai ver:

```
==> Building image
==> Pushing image to fly
==> Deploying
==> Monitoring deployment
```

Quando terminar:

```
✓ Deployment successful
```

---

## Passo 6: Testar o Backend

### 6.1 Ver a URL do seu app:

```bash
flyctl info
```

Ou:

```bash
flyctl status
```

A URL será algo como: `https://powerbi-scraper-backend.fly.dev`

### 6.2 Testar endpoints:

**Health check:**
```
https://powerbi-scraper-backend.fly.dev/health
```

**API de eventos:**
```
https://powerbi-scraper-backend.fly.dev/api/events
```

---

## Passo 7: Configurar CORS

Depois que o frontend estiver no ar, atualize o CORS:

```bash
flyctl secrets set ALLOWED_ORIGINS="https://seu-site.github.io,https://seu-site.netlify.app"
```

O app vai reiniciar automaticamente.

---

## Comandos Úteis

### Ver logs em tempo real:

```bash
flyctl logs
```

### Ver status do app:

```bash
flyctl status
```

### Abrir dashboard web:

```bash
flyctl dashboard
```

### Reiniciar app:

```bash
flyctl apps restart powerbi-scraper-backend
```

### Ver uso de recursos:

```bash
flyctl scale show
```

### Escalar (se precisar mais recursos):

```bash
# Aumentar memória para 512 MB (ainda gratuito)
flyctl scale memory 512

# Aumentar para 2 VMs (redundância)
flyctl scale count 2
```

---

## Troubleshooting

### Erro: "Could not find App"

```bash
# Liste seus apps
flyctl apps list

# Se não existir, crie
flyctl apps create powerbi-scraper-backend
```

### Erro: "Dockerfile not found"

Certifique-se de estar na pasta `backend/` onde está o `Dockerfile`.

### Erro de build:

```bash
# Limpar cache e tentar novamente
flyctl deploy --no-cache
```

### App não responde:

```bash
# Ver logs
flyctl logs

# Reiniciar
flyctl apps restart powerbi-scraper-backend
```

---

## Monitoramento

### Dashboard Web:

```bash
flyctl dashboard
```

Ou acesse: https://fly.io/dashboard

### Métricas:

- CPU usage
- Memory usage
- Request count
- Response time

### Alertas:

Configure alertas no dashboard para:
- App down
- High memory usage
- High CPU usage

---

## Custos

### Plano Gratuito Inclui:

- ✅ 3 VMs shared-cpu-1x (256 MB RAM cada)
- ✅ 160 GB bandwidth/mês
- ✅ Sem sleep/cold start
- ✅ Gratuito para sempre

### Você Está Usando:

- 1 VM de 256 MB = **Gratuito**
- Bandwidth estimado: ~5-10 GB/mês = **Gratuito**

**Total: $0/mês** 💰

---

## Próximos Passos

1. ✅ Backend rodando no Fly.io
2. 🔄 Deploy do frontend (GitHub Pages/Netlify)
3. 🔄 Atualizar CORS com URL do frontend
4. 🔄 Testar integração completa

---

## Suporte

- **Docs**: https://fly.io/docs
- **Community**: https://community.fly.io
- **Status**: https://status.fly.io

---

**Dica**: Salve a URL do seu backend! Você vai precisar dela para configurar o frontend.
