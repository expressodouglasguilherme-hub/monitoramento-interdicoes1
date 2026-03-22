# Deploy do Frontend - Netlify

## Pré-requisitos
- Conta no GitHub (gratuita)
- Conta no Netlify (gratuita)
- Código do projeto commitado no GitHub

## Passo 1: Preparar o Repositório no GitHub

Se você ainda não tem o código no GitHub:

1. Crie um repositório no GitHub: https://github.com/new
2. Nome sugerido: `monitoramento-interdicoes`
3. Deixe como público ou privado (ambos funcionam)
4. NÃO inicialize com README (você já tem o código)

## Passo 2: Subir o Código para o GitHub

No seu terminal (CMD), na pasta do projeto:

```cmd
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/monitoramento-interdicoes.git
git push -u origin main
```

**Nota:** Se você não tem Git instalado, pode fazer upload manual:
1. Compacte a pasta do projeto em um ZIP
2. No GitHub, vá em "uploading an existing file"
3. Arraste o ZIP ou selecione os arquivos

## Passo 3: Deploy no Netlify

### Opção A: Deploy via GitHub (Recomendado)

1. Acesse: https://app.netlify.com/
2. Clique em "Add new site" → "Import an existing project"
3. Escolha "Deploy with GitHub"
4. Autorize o Netlify a acessar seus repositórios
5. Selecione o repositório `monitoramento-interdicoes`
6. Configure o build:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Environment variables:** 
     - Clique em "Add environment variables"
     - Nome: `VITE_API_BASE_URL`
     - Valor: `https://backend-bitter-butterfly-9549.fly.dev`
7. Clique em "Deploy site"

### Opção B: Deploy Manual (Sem Git)

Se você não quer usar Git/GitHub:

1. No terminal, rode: `npm run build`
2. Isso vai criar uma pasta `dist` com os arquivos compilados
3. Acesse: https://app.netlify.com/drop
4. Arraste a pasta `dist` para a área de upload
5. Pronto! O site estará online

**Importante:** No deploy manual, você precisa configurar a variável de ambiente depois:
1. No dashboard do Netlify, vá em "Site settings"
2. "Environment variables" → "Add a variable"
3. Nome: `VITE_API_BASE_URL`
4. Valor: `https://backend-bitter-butterfly-9549.fly.dev`
5. Clique em "Deploys" → "Trigger deploy" → "Deploy site"

## Passo 4: Testar o Site

Após o deploy, o Netlify vai te dar uma URL tipo:
```
https://seu-site-123abc.netlify.app
```

Acesse essa URL e teste:
- O site deve carregar
- O mapa deve aparecer
- A tabela deve aparecer (pode estar vazia se o backend não tiver dados)

## Passo 5: Configurar Domínio Personalizado (Opcional)

Se você quiser um domínio personalizado:

1. No Netlify, vá em "Domain settings"
2. Clique em "Add custom domain"
3. Digite seu domínio (ex: `interdicoes.com.br`)
4. Siga as instruções para configurar o DNS

## Troubleshooting

### Site não carrega
- Verifique se o build foi bem-sucedido no Netlify
- Veja os logs de build para erros

### API não funciona
- Verifique se a variável `VITE_API_BASE_URL` está configurada
- Teste o backend diretamente: `https://backend-bitter-butterfly-9549.fly.dev/health`

### Erro de CORS
- O backend já está configurado para aceitar requisições de qualquer origem
- Se ainda der erro, verifique os logs do backend: `flyctl logs`

## Atualizações Futuras

### Com GitHub conectado:
- Faça suas mudanças no código
- Commit e push para o GitHub
- O Netlify vai fazer deploy automático!

### Deploy manual:
- Rode `npm run build`
- Arraste a nova pasta `dist` para o Netlify Drop

## URLs Importantes

- **Backend:** https://backend-bitter-butterfly-9549.fly.dev
- **Frontend:** (será gerado pelo Netlify)
- **Netlify Dashboard:** https://app.netlify.com/

## Custos

- ✅ Netlify: 100% gratuito (100GB bandwidth/mês)
- ✅ Fly.io: Gratuito no tier free (3 máquinas compartilhadas)
- ✅ Total: R$ 0,00/mês

## Suporte

Se tiver problemas:
1. Verifique os logs no Netlify
2. Verifique os logs do backend: `flyctl logs`
3. Teste o backend diretamente no navegador
