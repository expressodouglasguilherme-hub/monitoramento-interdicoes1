# ✅ Checklist de Deploy - Render.com

Use este checklist para garantir que tudo está configurado corretamente.

## Antes do Deploy

- [ ] Código do backend está completo e testado localmente
- [ ] Código está commitado no GitHub
- [ ] Arquivo `render.yaml` está na raiz do projeto
- [ ] Você tem uma conta no Render.com

## Durante o Deploy

### 1. Configuração Inicial
- [ ] Conta criada no Render.com
- [ ] GitHub conectado ao Render
- [ ] Repositório selecionado
- [ ] "Web Service" criado

### 2. Configurações do Service
- [ ] Name: `powerbi-scraper-backend`
- [ ] Region: `Oregon (US West)` ou mais próximo
- [ ] Branch: `main`
- [ ] Root Directory: `backend`
- [ ] Runtime: `Node`
- [ ] Plan: `Free`

### 3. Build & Start Commands
- [ ] Build Command: `npm install && npx playwright install --with-deps chromium && npm run build`
- [ ] Start Command: `npm start`

### 4. Variáveis de Ambiente
- [ ] `PORT` = `3000`
- [ ] `POWERBI_URL` = `https://estradasbloqueadas.com.br`
- [ ] `CACHE_DURATION_MS` = `300000`
- [ ] `SCRAPING_TIMEOUT_MS` = `30000`
- [ ] `LOG_LEVEL` = `info`
- [ ] `ALLOWED_ORIGINS` = URL do seu frontend (ex: `https://seu-usuario.github.io`)

### 5. Deploy
- [ ] Clicou em "Create Web Service"
- [ ] Aguardou o build completar (~5-10 min)
- [ ] Build concluiu com sucesso (sem erros)

## Após o Deploy

### 6. Testes do Backend
- [ ] Anotou a URL do Render (ex: `https://powerbi-scraper-backend.onrender.com`)
- [ ] Testou `/health` - retorna `{"status":"ok",...}`
- [ ] Testou `/api/events` - retorna array de eventos (pode demorar na primeira vez)
- [ ] Verificou logs no Render (sem erros críticos)

### 7. Configuração do Frontend
- [ ] Atualizou `.env` com `VITE_API_URL=https://sua-url.onrender.com`
- [ ] Commitou e fez push do `.env` atualizado
- [ ] Frontend fez redeploy (GitHub Pages/Netlify)

### 8. Teste Integrado
- [ ] Abriu o frontend no navegador
- [ ] Mapa carrega corretamente
- [ ] Eventos aparecem no mapa
- [ ] Tabela mostra os dados
- [ ] Não há erros de CORS no console

### 9. CORS Final
- [ ] Voltou no Render
- [ ] Atualizou `ALLOWED_ORIGINS` com URL real do frontend
- [ ] Salvou e aguardou redeploy
- [ ] Testou novamente - sem erros de CORS

## Opcional (Recomendado)

### 10. Keep-Alive (Evitar Sleep)
- [ ] Criou conta no UptimeRobot (https://uptimerobot.com)
- [ ] Adicionou monitor HTTP(S)
- [ ] URL: `https://sua-url.onrender.com/health`
- [ ] Intervalo: 14 minutos
- [ ] Monitor ativo

### 11. Monitoramento
- [ ] Configurou alertas no Render (opcional)
- [ ] Adicionou URL aos favoritos para acesso rápido aos logs
- [ ] Testou acesso aos logs e métricas

## Troubleshooting

Se algo der errado, verifique:

### Build Falha
- [ ] Verificou logs de build no Render
- [ ] Confirmou que `backend/package.json` existe
- [ ] Confirmou que Root Directory está como `backend`

### Runtime Errors
- [ ] Verificou logs de runtime no Render
- [ ] Confirmou que todas as variáveis de ambiente estão configuradas
- [ ] Testou localmente com as mesmas variáveis

### CORS Errors
- [ ] Verificou que `ALLOWED_ORIGINS` tem a URL correta
- [ ] Verificou que não tem espaços extras na URL
- [ ] Testou com múltiplas origens separadas por vírgula

### Timeout no Scraping
- [ ] Aumentou `SCRAPING_TIMEOUT_MS` para `60000`
- [ ] Verificou se o Power BI está acessível
- [ ] Testou a URL do Power BI manualmente

## URLs Importantes

Anote aqui suas URLs:

- **Backend Render**: `https://_____________________.onrender.com`
- **Frontend GitHub Pages**: `https://_____________________.github.io`
- **Dashboard Render**: `https://dashboard.render.com`
- **Logs Render**: `https://dashboard.render.com/web/___________/logs`

## Próximos Passos

Após tudo funcionando:

- [ ] Documentar a URL do backend em local seguro
- [ ] Compartilhar URL do frontend com usuários
- [ ] Monitorar uso e performance
- [ ] Considerar upgrade se necessário

---

**Dica**: Imprima ou salve este checklist para referência futura!
