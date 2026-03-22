# Guia de Deploy Online Gratuito

Este guia mostra como colocar seu sistema online gratuitamente, sem precisar instalar nada no seu computador.

## 🚀 Opções de Deploy Gratuito

### Opção 1: Netlify (Mais Fácil) ⭐ RECOMENDADO

**Vantagens:**
- Deploy automático via GitHub
- HTTPS gratuito
- Domínio gratuito (.netlify.app)
- Interface visual simples
- Sem necessidade de cartão de crédito

**Passos:**

1. **Criar conta no GitHub** (se não tiver)
   - Acesse: https://github.com/signup
   - Crie sua conta gratuita

2. **Fazer upload do código para GitHub**
   - Crie um novo repositório em: https://github.com/new
   - Nome: `monitoramento-interdicoes`
   - Público ou Privado (sua escolha)
   - Faça upload de todos os arquivos do projeto

3. **Criar conta no Netlify**
   - Acesse: https://www.netlify.com/
   - Clique em "Sign up" e use sua conta do GitHub
   - Autorize o Netlify a acessar seus repositórios

4. **Fazer Deploy**
   - No Netlify, clique em "Add new site" → "Import an existing project"
   - Escolha "GitHub"
   - Selecione o repositório `monitoramento-interdicoes`
   - Configurações de build (já estão no arquivo `netlify.toml`):
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Clique em "Deploy site"

5. **Pronto!**
   - Seu site estará online em alguns minutos
   - URL será algo como: `https://seu-site.netlify.app`
   - Você pode personalizar o domínio nas configurações

---

### Opção 2: Vercel

**Vantagens:**
- Deploy automático via GitHub
- HTTPS gratuito
- Domínio gratuito (.vercel.app)
- Muito rápido

**Passos:**

1. **Criar conta no GitHub** (se não tiver)
   - Acesse: https://github.com/signup

2. **Fazer upload do código para GitHub**
   - Crie um novo repositório
   - Faça upload de todos os arquivos

3. **Criar conta no Vercel**
   - Acesse: https://vercel.com/signup
   - Use sua conta do GitHub

4. **Fazer Deploy**
   - Clique em "Add New Project"
   - Selecione seu repositório
   - Clique em "Deploy"

5. **Pronto!**
   - URL será algo como: `https://seu-site.vercel.app`

---

### Opção 3: GitHub Pages

**Vantagens:**
- Totalmente gratuito
- Integrado com GitHub
- HTTPS gratuito

**Passos:**

1. **Criar conta no GitHub**
   - Acesse: https://github.com/signup

2. **Fazer upload do código**
   - Crie um novo repositório
   - Faça upload de todos os arquivos

3. **Configurar GitHub Pages**
   - No repositório, vá em "Settings" → "Pages"
   - Em "Source", selecione "GitHub Actions"
   - O arquivo `.github/workflows/deploy.yml` já está configurado

4. **Fazer Deploy**
   - Faça um commit na branch `main`
   - O deploy acontecerá automaticamente

5. **Pronto!**
   - URL será: `https://seu-usuario.github.io/monitoramento-interdicoes`

---

## 📝 Passo a Passo Detalhado (Netlify)

### 1. Preparar o Código no GitHub

**Se você não tem Git instalado:**

1. Acesse: https://github.com/new
2. Nome do repositório: `monitoramento-interdicoes`
3. Deixe público
4. Clique em "Create repository"
5. Na página do repositório, clique em "uploading an existing file"
6. Arraste TODOS os arquivos do projeto
7. Clique em "Commit changes"

**Se você tem Git instalado:**

```bash
# No terminal, dentro da pasta do projeto:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/monitoramento-interdicoes.git
git push -u origin main
```

### 2. Deploy no Netlify

1. **Acesse:** https://app.netlify.com/signup
2. **Clique em:** "Sign up with GitHub"
3. **Autorize** o Netlify
4. **Clique em:** "Add new site" → "Import an existing project"
5. **Escolha:** "GitHub"
6. **Selecione:** seu repositório `monitoramento-interdicoes`
7. **Configurações:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - (Já está configurado no `netlify.toml`)
8. **Clique em:** "Deploy site"
9. **Aguarde** 2-3 minutos

### 3. Acessar seu Site

Após o deploy, você verá:
- ✅ Site publicado
- 🌐 URL: `https://random-name-123.netlify.app`

**Personalizar URL:**
1. Vá em "Site settings" → "Change site name"
2. Escolha um nome: `monitoramento-interdicoes`
3. Nova URL: `https://monitoramento-interdicoes.netlify.app`

---

## 🔧 Configurar API Backend

O sistema precisa de uma API para funcionar. Você tem 3 opções:

### Opção 1: Deploy do Backend no Render.com (Recomendado) ⭐

**O projeto já tem um backend completo com scraping do Power BI!**

📖 **Guias disponíveis:**
- **Rápido (5 min)**: [DEPLOY-RAPIDO.md](DEPLOY-RAPIDO.md)
- **Completo**: [DEPLOY-RENDER.md](DEPLOY-RENDER.md)
- **Checklist**: [CHECKLIST-DEPLOY.md](CHECKLIST-DEPLOY.md)

**Resumo:**
1. Acesse: https://render.com/
2. Crie conta com GitHub
3. New → Web Service → Selecione seu repositório
4. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install && npx playwright install --with-deps chromium && npm run build`
   - Start Command: `npm start`
5. Adicione variáveis de ambiente (veja guia completo)
6. Deploy!
7. Copie a URL: `https://seu-backend.onrender.com`
8. Atualize `.env` do frontend:
   ```
   VITE_API_URL=https://seu-backend.onrender.com
   ```

**Vantagens:**
- ✅ Scraping real do Power BI
- ✅ Cache inteligente (5 min)
- ✅ Totalmente gratuito
- ✅ Deploy automático do GitHub
- ✅ Logs e monitoramento

### Opção 2: Usar Mock Data (Mais Simples)

Se quiser testar sem backend:

Modifique o arquivo `src/context/EventContext.tsx` para usar dados mock:

```typescript
// Adicione no início do arquivo
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    cidade: 'São Paulo',
    uf: 'SP',
    local: 'Rodovia Anhanguera, km 50',
    observacao: 'Interdição total devido a acidente',
    latitude: -23.5505,
    longitude: -46.6333,
    dataAtualizacao: new Date().toISOString(),
  },
  // Adicione mais eventos mock aqui
];

// No EventProvider, use MOCK_EVENTS em vez de chamar a API
```

### Opção 3: Usar Supabase (Backend Alternativo)

1. Acesse: https://supabase.com/
2. Crie uma conta
3. Crie um novo projeto
4. Crie uma tabela `events` com as colunas necessárias
5. Use a API REST do Supabase
6. Atualize o `APIService.ts` para usar a API do Supabase

---

## 🎯 Checklist de Deploy

- [ ] Código no GitHub
- [ ] Conta criada no Netlify/Vercel
- [ ] Repositório conectado
- [ ] Deploy realizado
- [ ] Site acessível online
- [ ] API configurada (mock ou real)
- [ ] Testado em diferentes dispositivos

---

## 🆘 Problemas Comuns

### "Build failed"
- Verifique se todos os arquivos foram enviados para o GitHub
- Verifique se o `package.json` está correto
- Veja os logs de build no Netlify/Vercel

### "Site não carrega"
- Aguarde alguns minutos após o deploy
- Limpe o cache do navegador (Ctrl + Shift + R)
- Verifique se a URL está correta

### "Mapa não aparece"
- Verifique sua conexão com a internet
- O mapa usa tiles do OpenStreetMap (requer internet)

### "API não funciona"
- Verifique se a variável `VITE_API_BASE_URL` está configurada
- Use dados mock temporariamente
- Verifique CORS no backend

---

## 📱 Compartilhar seu Site

Depois do deploy, você pode compartilhar:

- **URL direta:** `https://seu-site.netlify.app`
- **QR Code:** Use um gerador de QR code online
- **Redes sociais:** Compartilhe o link

---

## 🔄 Atualizações Automáticas

Após configurar, qualquer mudança que você fizer no GitHub será automaticamente deployada:

1. Faça alterações no código
2. Faça commit no GitHub
3. O Netlify/Vercel detecta automaticamente
4. Faz o build e deploy
5. Site atualizado em 2-3 minutos

---

## 💰 Custos

**Tudo é 100% GRATUITO:**
- ✅ Netlify: Gratuito para sempre
- ✅ Vercel: Gratuito para sempre
- ✅ GitHub Pages: Gratuito para sempre
- ✅ GitHub: Gratuito para repositórios públicos
- ✅ Render.com: Plano gratuito disponível
- ✅ Supabase: Plano gratuito generoso

**Sem necessidade de:**
- ❌ Cartão de crédito
- ❌ Instalação de software
- ❌ Servidor próprio
- ❌ Conhecimento avançado

---

## 🎓 Tutoriais em Vídeo

**Netlify:**
- https://www.youtube.com/results?search_query=netlify+deploy+tutorial

**Vercel:**
- https://www.youtube.com/results?search_query=vercel+deploy+tutorial

**GitHub Pages:**
- https://www.youtube.com/results?search_query=github+pages+tutorial

---

## ✅ Próximos Passos

1. Escolha uma plataforma (recomendo Netlify)
2. Siga o passo a passo acima
3. Seu site estará online em minutos!
4. Compartilhe com o mundo 🌍

**Dúvidas?** Consulte a documentação oficial de cada plataforma.
