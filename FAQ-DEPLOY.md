# ❓ FAQ - Perguntas Frequentes sobre Deploy

Respostas para as dúvidas mais comuns sobre deploy do sistema.

## 🚀 Geral

### P: Preciso pagar alguma coisa?

**R:** Não! Tudo é 100% gratuito:
- GitHub Pages: Gratuito
- Netlify: Gratuito
- Render.com: Plano gratuito disponível
- Sem necessidade de cartão de crédito

### P: Quanto tempo demora o deploy?

**R:** 
- Backend (Render): ~5-10 minutos (primeira vez)
- Frontend (GitHub Pages): ~2-3 minutos
- Total: ~15 minutos

### P: Preciso saber programar?

**R:** Não precisa! Basta seguir o guia passo a passo. Mas ajuda entender o básico de:
- Git/GitHub
- Variáveis de ambiente
- URLs e APIs

### P: Posso usar meu próprio domínio?

**R:** Sim! Tanto Render quanto GitHub Pages/Netlify suportam domínios customizados. Veja a documentação de cada plataforma.

## 🔧 Backend (Render.com)

### P: Por que o backend "dorme"?

**R:** No plano gratuito do Render, serviços dormem após 15 minutos de inatividade. Isso economiza recursos. Soluções:
- Aceitar o cold start (~30s na primeira requisição)
- Usar keep-alive (UptimeRobot)
- Upgrade para plano pago ($7/mês)

### P: O que é "cold start"?

**R:** É o tempo que o Render leva para "acordar" seu serviço após ele dormir. Primeira requisição demora ~30-60 segundos, depois fica rápido.

### P: Como evitar cold start?

**R:** Use um serviço de keep-alive gratuito:
- UptimeRobot: https://uptimerobot.com
- Cron-job.org: https://cron-job.org
- Configure para fazer ping a cada 14 minutos

Veja detalhes em [RENDER-TIPS.md](RENDER-TIPS.md)

### P: Posso usar outro serviço além do Render?

**R:** Sim! Alternativas:
- Railway.app (gratuito com limites)
- Fly.io (gratuito com limites)
- Heroku (pago, mínimo $5/mês)
- VPS próprio (DigitalOcean, AWS, etc)

### P: O backend funciona 24/7?

**R:** Sim, mas com limitações no plano gratuito:
- 750 horas/mês (suficiente para 24/7)
- Sleep após 15 min de inatividade
- Cold start na primeira requisição

### P: Quantos usuários simultâneos suporta?

**R:** No plano gratuito: ~50-100 usuários simultâneos. Depende de:
- Uso de cache
- Frequência de scraping
- Complexidade das requisições

### P: O que acontece se o Power BI sair do ar?

**R:** O backend usa cache como fallback:
- Se cache válido: retorna dados do cache
- Se cache expirado: retorna cache antigo mesmo assim
- Sistema continua funcionando com dados desatualizados

## 🎨 Frontend

### P: GitHub Pages vs Netlify vs Vercel?

**R:** Todos são gratuitos e bons. Diferenças:

**GitHub Pages:**
- ✅ Integrado com GitHub
- ✅ Simples
- ❌ Menos features

**Netlify:**
- ✅ Deploy automático
- ✅ Preview de PRs
- ✅ Formulários gratuitos
- ✅ Mais fácil

**Vercel:**
- ✅ Muito rápido
- ✅ Bom para Next.js
- ✅ Analytics gratuito

**Recomendação:** Netlify para iniciantes.

### P: Posso usar os três ao mesmo tempo?

**R:** Sim! Você pode fazer deploy em múltiplas plataformas. Útil para:
- Testes
- Backup
- Diferentes ambientes (staging/production)

### P: Como atualizar o site depois do deploy?

**R:** Basta fazer push para o GitHub:
```bash
git add .
git commit -m "Update"
git push origin main
```

O deploy acontece automaticamente!

## 🔐 Segurança

### P: Meus dados estão seguros?

**R:** Sim! O sistema:
- Usa HTTPS (criptografado)
- Não armazena dados sensíveis
- Apenas lê dados públicos do Power BI
- CORS configurado

### P: Alguém pode hackear minha API?

**R:** Proteções implementadas:
- Rate limiting (60 req/min por IP)
- CORS (apenas origens permitidas)
- Headers de segurança
- Sem autenticação necessária (dados públicos)

### P: Preciso de API key?

**R:** Não! Os dados do Power BI são públicos. Não precisa de autenticação.

## 📊 Dados e Cache

### P: Com que frequência os dados são atualizados?

**R:** Depende do cache:
- Cache válido (< 5 min): dados do cache
- Cache expirado: scraping do Power BI
- Máximo: a cada 5 minutos (quando há requisições)

### P: Posso mudar o tempo de cache?

**R:** Sim! Configure `CACHE_DURATION_MS` no Render:
```
300000 = 5 minutos (padrão)
120000 = 2 minutos
900000 = 15 minutos
```

### P: Os dados são salvos em banco de dados?

**R:** Não. O cache é em memória (RAM). Quando o serviço reinicia, o cache é perdido. Isso é intencional para manter o sistema simples e gratuito.

### P: Posso adicionar banco de dados?

**R:** Sim! Opções gratuitas:
- Supabase (PostgreSQL)
- MongoDB Atlas
- PlanetScale (MySQL)
- Upstash (Redis)

Mas não é necessário para o funcionamento básico.

## 🐛 Problemas Comuns

### P: Build falhou no Render. O que fazer?

**R:** Verifique:
1. Logs de build no Render
2. Root Directory está como `backend`
3. Build command está correto
4. package.json existe no diretório backend

Veja [RENDER-TIPS.md](RENDER-TIPS.md) para mais detalhes.

### P: Erro de CORS. Como resolver?

**R:** 
1. Verifique `ALLOWED_ORIGINS` no Render
2. Deve ter a URL EXATA do frontend
3. Sem `/` no final
4. Exemplo: `https://seu-usuario.github.io`

### P: Frontend não carrega dados. O que fazer?

**R:** Verifique:
1. Backend está rodando (teste `/health`)
2. `VITE_API_URL` está correto no `.env`
3. Não há erros de CORS no console
4. Backend não está dormindo (cold start)

### P: Scraping está falhando. Por quê?

**R:** Possíveis causas:
1. Power BI mudou estrutura (seletores CSS)
2. Timeout muito curto (aumente para 60s)
3. Power BI está fora do ar
4. Rede do Render está lenta

Solução: Verifique logs no Render.

### P: "Cannot find module" no build. Como resolver?

**R:** 
1. Verifique se todas as dependências estão no `package.json`
2. Limpe build cache no Render
3. Faça redeploy manual

## 💰 Custos e Limites

### P: Quais são os limites do plano gratuito?

**R:** Render.com (Free):
- 750 horas/mês (suficiente para 24/7)
- 512 MB RAM
- 100 GB bandwidth/mês
- Sleep após 15 min de inatividade
- Builds ilimitados

### P: Quando preciso fazer upgrade?

**R:** Considere upgrade se:
- Cold start incomoda usuários
- Muitos usuários simultâneos (>100)
- Precisa de mais RAM
- Quer múltiplas regiões

### P: Quanto custa o upgrade?

**R:** Render.com:
- Starter: $7/mês (sem sleep, 512 MB RAM)
- Standard: $25/mês (2 GB RAM, mais CPU)

### P: Posso começar grátis e fazer upgrade depois?

**R:** Sim! Você pode:
1. Começar no plano gratuito
2. Testar tudo
3. Fazer upgrade quando necessário
4. Sem perda de dados ou configurações

## 🔄 Manutenção

### P: Preciso fazer manutenção?

**R:** Mínima:
- Monitorar logs ocasionalmente
- Verificar se está funcionando
- Atualizar dependências (opcional)

### P: Como atualizar dependências?

**R:** 
1. Atualize `package.json` localmente
2. Teste localmente
3. Commit e push
4. Render faz redeploy automaticamente

### P: Como fazer backup?

**R:** O código está no GitHub (já é um backup). Para backup completo:
1. Clone o repositório
2. Exporte configurações do Render (variáveis de ambiente)
3. Documente URLs e configurações

### P: E se o Render sair do ar?

**R:** 
1. Verifique status: https://status.render.com
2. Frontend continua funcionando
3. Dados em cache no navegador ainda funcionam
4. Pode migrar para outro serviço (Railway, Fly.io)

## 📱 Uso e Compartilhamento

### P: Como compartilhar meu site?

**R:** Compartilhe a URL do frontend:
- GitHub Pages: `https://seu-usuario.github.io/repo`
- Netlify: `https://seu-site.netlify.app`
- Domínio customizado: `https://seu-dominio.com`

### P: Posso usar em produção?

**R:** Sim! O sistema está pronto para produção. Mas considere:
- Monitoramento
- Keep-alive (evitar cold start)
- Backup de configurações
- Plano pago se tiver muitos usuários

### P: Quantas pessoas podem acessar?

**R:** Ilimitado! Mas performance depende de:
- Plano do Render (gratuito: ~50-100 simultâneos)
- Uso de cache
- Bandwidth (100 GB/mês no gratuito)

### P: Funciona em celular?

**R:** Sim! O frontend é responsivo e funciona em:
- Desktop
- Tablet
- Celular
- Qualquer navegador moderno

## 🎓 Aprendizado

### P: Onde aprender mais sobre Render?

**R:** 
- Docs: https://render.com/docs
- Community: https://community.render.com
- YouTube: Tutoriais de deploy no Render

### P: Onde aprender mais sobre Playwright?

**R:** 
- Docs: https://playwright.dev
- GitHub: https://github.com/microsoft/playwright
- Exemplos: https://playwright.dev/docs/examples

### P: Como contribuir com o projeto?

**R:** 
1. Fork no GitHub
2. Faça suas melhorias
3. Abra um Pull Request
4. Ou abra uma Issue com sugestões

## 🆘 Ainda Tem Dúvidas?

### Não encontrou sua resposta?

1. Consulte os guias específicos:
   - [DEPLOY-RENDER.md](DEPLOY-RENDER.md)
   - [RENDER-TIPS.md](RENDER-TIPS.md)
   - [ARQUITETURA-DEPLOY.md](ARQUITETURA-DEPLOY.md)

2. Verifique a documentação oficial:
   - Render: https://render.com/docs
   - Playwright: https://playwright.dev

3. Procure na comunidade:
   - Render Community: https://community.render.com
   - Stack Overflow

4. Abra uma issue no GitHub do projeto

---

**Dica:** Salve este FAQ para consulta rápida!
