# Deploy do Frontend - GitHub Pages (SEM INSTALAR NADA!)

## Por que GitHub Pages?
- ✅ 100% gratuito
- ✅ Não precisa instalar Node.js ou Git
- ✅ Deploy automático quando você atualizar o código
- ✅ HTTPS gratuito
- ✅ Funciona 24/7 sem seu PC ligado

## Passo 1: Criar Conta no GitHub

1. Acesse: https://github.com/signup
2. Crie sua conta (gratuita)
3. Confirme seu email

## Passo 2: Criar Repositório

1. Acesse: https://github.com/new
2. Nome do repositório: `monitoramento-interdicoes` (ou qualquer nome)
3. Deixe como **Public** (necessário para GitHub Pages gratuito)
4. NÃO marque "Add a README file"
5. Clique em "Create repository"

## Passo 3: Fazer Upload dos Arquivos

### Opção A: Upload via Interface Web (Mais Fácil)

1. Na página do repositório, clique em "uploading an existing file"
2. Arraste TODOS os arquivos e pastas do seu projeto
   - Inclua a pasta `.github` (importante!)
   - Inclua TUDO exceto `node_modules` (se existir)
3. No campo de commit, escreva: "Initial commit"
4. Clique em "Commit changes"

### Opção B: Upload via GitHub Desktop (Alternativa)

1. Baixe o GitHub Desktop: https://desktop.github.com/
2. Instale e faça login
3. Clone o repositório que você criou
4. Copie todos os arquivos do projeto para a pasta clonada
5. Commit e push

## Passo 4: Ativar GitHub Pages

1. No seu repositório, vá em "Settings" (configurações)
2. No menu lateral, clique em "Pages"
3. Em "Source", selecione: **GitHub Actions**
4. Pronto! Não precisa salvar, é automático

## Passo 5: Aguardar o Deploy

1. Vá na aba "Actions" do repositório
2. Você verá um workflow rodando chamado "Deploy to GitHub Pages"
3. Aguarde terminar (leva 2-3 minutos)
4. Quando aparecer um ✅ verde, está pronto!

## Passo 6: Acessar Seu Site

Seu site estará disponível em:
```
https://SEU-USUARIO.github.io/monitoramento-interdicoes/
```

Substitua `SEU-USUARIO` pelo seu nome de usuário do GitHub.

## O Que Foi Configurado Automaticamente

O arquivo `.github/workflows/deploy.yml` que eu criei faz:
1. Instala o Node.js nos servidores do GitHub
2. Instala as dependências do projeto
3. Compila o código (build)
4. Configura a URL do backend automaticamente
5. Faz deploy para o GitHub Pages

Tudo isso acontece nos servidores do GitHub, não no seu PC!

## Atualizações Futuras

Quando você quiser atualizar o site:
1. Faça as mudanças nos arquivos
2. Faça upload dos arquivos atualizados no GitHub
3. O deploy acontece automaticamente!

## Troubleshooting

### Workflow falhou
- Vá em "Actions" e clique no workflow que falhou
- Veja os logs para identificar o erro
- Geralmente é problema de permissões ou arquivos faltando

### Site não carrega
- Aguarde alguns minutos após o deploy
- Limpe o cache do navegador (Ctrl+F5)
- Verifique se o workflow terminou com sucesso

### API não funciona
- Verifique se o backend está rodando: https://backend-bitter-butterfly-9549.fly.dev/health
- O backend já está configurado no workflow

## URLs Importantes

- **Seu repositório:** https://github.com/SEU-USUARIO/monitoramento-interdicoes
- **Seu site:** https://SEU-USUARIO.github.io/monitoramento-interdicoes/
- **Backend:** https://backend-bitter-butterfly-9549.fly.dev

## Custos

- ✅ GitHub Pages: 100% gratuito
- ✅ GitHub Actions: 2000 minutos/mês grátis (mais que suficiente)
- ✅ Fly.io Backend: Gratuito no tier free
- ✅ Total: R$ 0,00/mês

## Próximos Passos

Depois que o site estiver online:
1. Teste todas as funcionalidades
2. Compartilhe a URL com quem precisar
3. O site funciona 24/7 sem seu PC ligado!
