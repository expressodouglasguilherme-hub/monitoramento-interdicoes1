# 🚀 Deploy Rápido - 5 Minutos

Guia super simplificado para fazer deploy no Render.com.

## 1️⃣ Preparar Código (1 min)

```bash
git add .
git commit -m "Prepare for Render deploy"
git push origin main
```

## 2️⃣ Criar Conta Render (1 min)

1. Acesse: https://render.com
2. Clique "Get Started for Free"
3. Login com GitHub
4. Autorize o Render

## 3️⃣ Criar Service (2 min)

1. Dashboard → "New +" → "Web Service"
2. Selecione seu repositório
3. Preencha:

```
Name: powerbi-scraper-backend
Region: Oregon
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install && npx playwright install --with-deps chromium && npm run build
Start Command: npm start
Plan: Free
```

## 4️⃣ Variáveis de Ambiente (1 min)

Adicione estas variáveis:

```
PORT=3000
POWERBI_URL=https://estradasbloqueadas.com.br
CACHE_DURATION_MS=300000
SCRAPING_TIMEOUT_MS=30000
LOG_LEVEL=info
ALLOWED_ORIGINS=https://SEU-USUARIO.github.io
```

⚠️ **Troque `SEU-USUARIO` pela sua URL real!**

## 5️⃣ Deploy! (5-10 min)

1. Clique "Create Web Service"
2. Aguarde o build (tome um café ☕)
3. Quando terminar, copie a URL: `https://powerbi-scraper-backend.onrender.com`

## 6️⃣ Testar (30 seg)

Abra no navegador:

```
https://sua-url.onrender.com/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"..."}
```

## 7️⃣ Conectar Frontend (1 min)

No seu projeto, edite `.env`:

```env
VITE_API_URL=https://sua-url.onrender.com
```

Commit e push:

```bash
git add .env
git commit -m "Connect to Render backend"
git push origin main
```

## ✅ Pronto!

Seu backend está no ar! 🎉

### Próximos Passos:

1. Teste o frontend
2. Se der erro de CORS, volte no Render e atualize `ALLOWED_ORIGINS`
3. Configure keep-alive (opcional): https://uptimerobot.com

---

**Problemas?** Veja o guia completo em [DEPLOY-RENDER.md](DEPLOY-RENDER.md)
