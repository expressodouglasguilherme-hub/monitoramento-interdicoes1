# 💡 Dicas e Truques - Render.com

Dicas práticas para otimizar seu backend no Render.

## 🚀 Performance

### 1. Evitar Cold Starts

O plano gratuito "dorme" após 15 min de inatividade. Soluções:

**Opção A: UptimeRobot (Recomendado)**
```
1. Acesse: https://uptimerobot.com
2. Crie conta gratuita
3. Add New Monitor:
   - Type: HTTP(s)
   - URL: https://seu-backend.onrender.com/health
   - Interval: 14 minutes
4. Salve
```

**Opção B: Cron-job.org**
```
1. Acesse: https://cron-job.org
2. Crie conta
3. Create cronjob:
   - URL: https://seu-backend.onrender.com/health
   - Schedule: */14 * * * * (a cada 14 min)
4. Ative
```

**Opção C: GitHub Actions (Avançado)**

Crie `.github/workflows/keep-alive.yml`:

```yaml
name: Keep Backend Alive
on:
  schedule:
    - cron: '*/14 * * * *'  # A cada 14 minutos
  workflow_dispatch:

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping backend
        run: curl https://seu-backend.onrender.com/health
```

### 2. Otimizar Cache

Ajuste o tempo de cache baseado no seu uso:

```env
# Atualização frequente (2 min)
CACHE_DURATION_MS=120000

# Padrão (5 min)
CACHE_DURATION_MS=300000

# Atualização menos frequente (15 min)
CACHE_DURATION_MS=900000
```

### 3. Timeout do Scraping

Se o scraping está falhando:

```env
# Aumentar timeout para 60 segundos
SCRAPING_TIMEOUT_MS=60000

# Ou 90 segundos se necessário
SCRAPING_TIMEOUT_MS=90000
```

## 🔒 Segurança

### 1. CORS Correto

Configure apenas as origens que você controla:

```env
# Produção
ALLOWED_ORIGINS=https://seu-site.github.io,https://seu-dominio.com

# Desenvolvimento + Produção
ALLOWED_ORIGINS=http://localhost:5173,https://seu-site.github.io

# Múltiplos domínios
ALLOWED_ORIGINS=https://site1.com,https://site2.com,https://site3.com
```

### 2. Rate Limiting

O backend já tem rate limiting (60 req/min por IP). Para ajustar, edite `src/server.ts`:

```typescript
// Mais restritivo (30 req/min)
windowMs: 60 * 1000,
max: 30,

// Mais permissivo (120 req/min)
windowMs: 60 * 1000,
max: 120,
```

### 3. Logs Seguros

Não logue dados sensíveis:

```env
# Produção - menos verbose
LOG_LEVEL=info

# Debug - mais detalhes
LOG_LEVEL=debug

# Apenas erros
LOG_LEVEL=error
```

## 📊 Monitoramento

### 1. Verificar Logs

```
Dashboard → Seu Service → Logs
```

Procure por:
- ✅ `Server started on port 3000`
- ✅ `Scraping completed: X events`
- ❌ `Error:` (qualquer erro)
- ⚠️ `Timeout` (scraping demorou muito)

### 2. Métricas Importantes

```
Dashboard → Seu Service → Metrics
```

Monitore:
- **CPU**: Deve ficar < 50% na média
- **Memory**: Deve ficar < 400 MB
- **Response Time**: Deve ser < 2s (exceto primeira requisição)

### 3. Alertas

Configure alertas no Render:

```
Settings → Notifications
- Deploy failed
- Service crashed
- High memory usage
```

## 🐛 Troubleshooting

### Problema: Build Falha

**Erro: "Cannot find module"**
```bash
# Solução: Verificar package.json
# Certifique-se que todas as dependências estão listadas
```

**Erro: "Out of memory"**
```json
// Adicione no package.json
"scripts": {
  "build": "tsc --max-old-space-size=512"
}
```

### Problema: Runtime Crash

**Erro: "Playwright browser not found"**
```bash
# Solução: Verificar build command
# Deve incluir: npx playwright install --with-deps chromium
```

**Erro: "Port already in use"**
```typescript
// Solução: Usar variável PORT do Render
const PORT = process.env.PORT || 3000;
```

### Problema: Scraping Falha

**Erro: "Timeout waiting for selector"**
```env
# Solução 1: Aumentar timeout
SCRAPING_TIMEOUT_MS=60000

# Solução 2: Verificar seletores
# Use Playwright Inspector localmente:
# npx playwright codegen https://estradasbloqueadas.com.br
```

**Erro: "Navigation timeout"**
```typescript
// Solução: Ajustar timeout no código
// src/services/scraper.ts
await page.goto(url, { 
  timeout: 60000,
  waitUntil: 'domcontentloaded' // Menos restritivo
});
```

### Problema: CORS Errors

**Erro: "Access-Control-Allow-Origin"**
```env
# Solução: Verificar ALLOWED_ORIGINS
# Deve ter a URL EXATA do frontend (sem / no final)
ALLOWED_ORIGINS=https://seu-usuario.github.io
```

**Erro: "Preflight request failed"**
```typescript
// Solução: Verificar se CORS está configurado
// src/server.ts deve ter:
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
```

## 💾 Backup e Restore

### Fazer Backup do Código

```bash
# Clone do repositório
git clone https://github.com/seu-usuario/seu-repo.git

# Ou download ZIP
# GitHub → Code → Download ZIP
```

### Restore em Caso de Problema

```bash
# Reverter para commit anterior
git revert HEAD
git push origin main

# Ou fazer rollback no Render
# Dashboard → Deploys → Selecione deploy anterior → Redeploy
```

## 🔄 Atualizações

### Deploy Manual

```
Dashboard → Manual Deploy → Clear build cache & deploy
```

Use quando:
- Mudou dependências
- Build está com cache antigo
- Quer forçar rebuild completo

### Deploy Automático

Já está configurado! Qualquer push para `main` faz deploy automático.

Para desabilitar:
```
Settings → Build & Deploy → Auto-Deploy: OFF
```

## 📈 Upgrade para Plano Pago

Se precisar de mais recursos:

**Starter ($7/mês)**
- ✅ Sem sleep
- ✅ 512 MB RAM
- ✅ Mais CPU
- ✅ Suporte prioritário

**Standard ($25/mês)**
- ✅ 2 GB RAM
- ✅ Ainda mais CPU
- ✅ Múltiplas regiões

Vale a pena se:
- Muitos usuários simultâneos
- Cold start incomoda
- Precisa de mais performance

## 🎯 Checklist de Otimização

- [ ] Keep-alive configurado (UptimeRobot)
- [ ] CORS com origens específicas
- [ ] Cache duration otimizado
- [ ] Logs em nível apropriado (info)
- [ ] Alertas configurados
- [ ] Monitoramento ativo
- [ ] Backup do código feito
- [ ] Documentação atualizada

## 📚 Recursos Úteis

- **Docs Render**: https://render.com/docs
- **Status Page**: https://status.render.com
- **Community**: https://community.render.com
- **Playwright Docs**: https://playwright.dev

## 🆘 Suporte

**Render Support:**
- Dashboard → Help → Contact Support
- Community: https://community.render.com

**Playwright Issues:**
- GitHub: https://github.com/microsoft/playwright/issues
- Docs: https://playwright.dev/docs/intro

---

**Dica Final**: Salve a URL do seu backend e as credenciais em um gerenciador de senhas!
