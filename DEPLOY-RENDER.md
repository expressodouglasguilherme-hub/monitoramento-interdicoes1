# Guia de Deploy no Render.com

Este guia mostra como fazer deploy do backend no Render.com (gratuito).

## Pré-requisitos

1. Conta no GitHub (você já tem)
2. Conta no Render.com (criar em https://render.com)
3. Código do backend commitado no GitHub

## Passo 1: Preparar o Repositório

Certifique-se de que o código está no GitHub:

```bash
git add .
git commit -m "Add backend with Render config"
git push origin main
```

## Passo 2: Criar Conta no Render

1. Acesse https://render.com
2. Clique em "Get Started for Free"
3. Faça login com sua conta do GitHub
4. Autorize o Render a acessar seus repositórios

## Passo 3: Criar Novo Web Service

1. No dashboard do Render, clique em "New +"
2. Selecione "Web Service"
3. Conecte seu repositório do GitHub
4. Selecione o repositório do projeto

## Passo 4: Configurar o Service

### Configurações Básicas:

- **Name**: `powerbi-scraper-backend` (ou o nome que preferir)
- **Region**: `Oregon (US West)` (ou mais próximo de você)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: 
  ```
  npm install && npx playwright install --with-deps chromium && npm run build
  ```
- **Start Command**: 
  ```
  npm start
  ```

### Configurações Avançadas:

- **Plan**: `Free` (selecione o plano gratuito)
- **Node Version**: `18.18.0`

## Passo 5: Configurar Variáveis de Ambiente

Na seção "Environment Variables", adicione:

| Key | Value |
|-----|-------|
| `PORT` | `3000` |
| `POWERBI_URL` | `https://estradasbloqueadas.com.br` |
| `CACHE_DURATION_MS` | `300000` |
| `SCRAPING_TIMEOUT_MS` | `30000` |
| `LOG_LEVEL` | `info` |
| `ALLOWED_ORIGINS` | `https://seu-usuario.github.io` |

⚠️ **IMPORTANTE**: Substitua `seu-usuario` pela URL real do seu GitHub Pages!

## Passo 6: Deploy

1. Clique em "Create Web Service"
2. O Render vai começar o deploy automaticamente
3. Aguarde ~5-10 minutos (primeira vez demora mais)
4. Você verá os logs do build em tempo real

## Passo 7: Testar o Backend

Após o deploy concluir, você receberá uma URL tipo:

```
https://powerbi-scraper-backend.onrender.com
```

Teste os endpoints:

1. **Health Check**: 
   ```
   https://powerbi-scraper-backend.onrender.com/health
   ```

2. **API de Eventos**: 
   ```
   https://powerbi-scraper-backend.onrender.com/api/events
   ```

## Passo 8: Configurar Frontend

Atualize o arquivo `.env` do frontend com a URL do Render:

```env
VITE_API_URL=https://powerbi-scraper-backend.onrender.com
```

Depois faça commit e push:

```bash
git add .env
git commit -m "Update API URL to Render"
git push origin main
```

## Passo 9: Atualizar CORS

Volte no Render e atualize a variável `ALLOWED_ORIGINS` com a URL correta do seu frontend:

```
https://seu-usuario.github.io,https://seu-dominio-custom.com
```

Depois clique em "Save Changes" - o Render vai fazer redeploy automaticamente.

## Limitações do Plano Gratuito

⚠️ **Importante saber**:

1. **Sleep após inatividade**: O serviço "dorme" após 15 minutos sem requisições
2. **Cold start**: Primeira requisição após dormir leva ~30-60 segundos
3. **750 horas/mês**: Suficiente para uso contínuo
4. **Bandwidth**: 100 GB/mês (mais que suficiente)

### Como lidar com o "sleep":

**Opção 1**: Aceitar o cold start (mais simples)
- Usuários esperam um pouco na primeira requisição
- Requisições seguintes são rápidas

**Opção 2**: Usar um serviço de "keep-alive" (gratuito)
- UptimeRobot: https://uptimerobot.com
- Cron-job.org: https://cron-job.org
- Configura para fazer ping a cada 14 minutos

**Opção 3**: Upgrade para plano pago ($7/mês)
- Sem sleep
- Mais recursos

## Monitoramento

### Ver Logs:

1. No dashboard do Render
2. Clique no seu service
3. Aba "Logs"
4. Veja logs em tempo real

### Métricas:

1. Aba "Metrics"
2. Veja CPU, memória, requisições

## Redeploy Manual

Se precisar fazer redeploy:

1. Aba "Settings"
2. Clique em "Manual Deploy"
3. Selecione "Clear build cache & deploy"

## Troubleshooting

### Build falha com erro de memória:

Adicione no `package.json` do backend:

```json
"scripts": {
  "build": "tsc --max-old-space-size=512"
}
```

### Playwright não funciona:

Certifique-se de que o build command inclui:

```
npx playwright install --with-deps chromium
```

### CORS errors:

Verifique se `ALLOWED_ORIGINS` está configurado corretamente com a URL do frontend.

### Timeout no scraping:

Aumente `SCRAPING_TIMEOUT_MS` para `60000` (60 segundos).

## Deploy Automático

O Render faz deploy automático quando você faz push para o GitHub! 🎉

Qualquer commit na branch `main` vai triggerar um novo deploy.

## Alternativa: Usar render.yaml

Se preferir, você pode usar o arquivo `render.yaml` na raiz do projeto. O Render vai detectar automaticamente e usar essas configurações.

Basta editar o arquivo e fazer commit:

```bash
git add render.yaml
git commit -m "Add Render config"
git push origin main
```

## Próximos Passos

1. ✅ Backend rodando no Render
2. ✅ Frontend conectado ao backend
3. 🔄 Configurar keep-alive (opcional)
4. 🔄 Adicionar domínio customizado (opcional)
5. 🔄 Configurar monitoramento (opcional)

## Suporte

- Documentação Render: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com

---

**Dica**: Salve a URL do seu backend em algum lugar seguro! Você vai precisar dela para configurar o frontend.
