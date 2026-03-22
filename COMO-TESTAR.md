# 🧪 Como Testar o Sistema

## Método 1: Abrir Direto no Navegador (MAIS FÁCIL) ⭐

1. **Localize o arquivo `preview.html`** na pasta do projeto
2. **Clique duas vezes** no arquivo
3. **Pronto!** O sistema abrirá no seu navegador

### ✅ O que você verá:

- 🗺️ Mapa interativo do Brasil com 5 eventos de exemplo
- 📊 Dashboard com total de eventos e gráfico por estado
- 📋 Tabela com detalhes de todos os eventos
- ➕ Botão "REPORTAR NOVO PONTO" funcionando

### 🎮 O que você pode testar:

1. **Visualizar eventos no mapa**
   - Clique nos marcadores para ver detalhes

2. **Ver métricas no dashboard**
   - Total de eventos
   - Gráfico de barras por estado

3. **Navegar pela tabela**
   - Veja todos os eventos listados
   - Role para ver mais

4. **Reportar novo evento**
   - Clique em "REPORTAR NOVO PONTO"
   - Preencha o formulário:
     - Cidade: Ex: Brasília
     - UF: Ex: DF
     - Local: Ex: Eixo Monumental
     - Observação: Ex: Protesto bloqueando via
   - Clique em "Reportar Evento"
   - Veja o novo evento aparecer no mapa, dashboard e tabela!

5. **Testar responsividade**
   - Redimensione a janela do navegador
   - Veja o layout se adaptar para mobile/tablet/desktop

6. **Testar navegação por teclado**
   - Pressione Tab para navegar
   - Pressione ESC para fechar o modal

---

## Método 2: Usar um Servidor Local (Se você tem Node.js)

Se você já instalou o Node.js:

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Acessar
http://localhost:5173
```

---

## 📱 Testar em Diferentes Dispositivos

### Desktop
- Abra `preview.html` no Chrome, Firefox, Edge ou Safari
- Teste em tela cheia

### Tablet/Mobile (Simulação)
1. Abra `preview.html` no navegador
2. Pressione F12 (DevTools)
3. Clique no ícone de dispositivo móvel (📱)
4. Escolha um dispositivo (iPhone, iPad, etc)
5. Teste a responsividade

### Smartphone Real
1. Coloque o arquivo `preview.html` no seu celular
2. Abra com o navegador do celular
3. Teste todas as funcionalidades

---

## ✅ Checklist de Testes

Marque o que você testou:

- [ ] Mapa carrega e exibe marcadores
- [ ] Cliquei em marcadores e vi popups
- [ ] Dashboard mostra total de eventos
- [ ] Gráfico de barras aparece
- [ ] Tabela lista todos os eventos
- [ ] Abri o modal "REPORTAR NOVO PONTO"
- [ ] Preenchi o formulário
- [ ] Reportei um novo evento
- [ ] Novo evento apareceu no mapa
- [ ] Novo evento apareceu no dashboard
- [ ] Novo evento apareceu na tabela
- [ ] Fechei o modal com ESC
- [ ] Testei em tela pequena (mobile)
- [ ] Testei navegação por teclado (Tab)

---

## 🎯 Diferenças entre Preview e Versão Final

### preview.html (Teste Local)
- ✅ Funciona offline
- ✅ Dados de exemplo (mock)
- ✅ Não precisa de servidor
- ✅ Perfeito para testar visual e funcionalidades
- ⚠️ Dados não são salvos (recarregar = reset)

### Versão Online (Deploy)
- ✅ Acessível de qualquer lugar
- ✅ URL permanente
- ✅ HTTPS seguro
- ✅ Pode conectar com API real
- ✅ Dados podem ser persistidos

---

## 🐛 Problemas Comuns

### Mapa não aparece
- **Solução:** Verifique sua conexão com internet
- O mapa usa tiles do OpenStreetMap (requer internet)

### Gráfico não aparece
- **Solução:** Aguarde alguns segundos
- O Chart.js precisa carregar da CDN

### Formulário não funciona
- **Solução:** Preencha todos os campos obrigatórios (*)
- UF deve ter exatamente 2 letras

### Layout quebrado
- **Solução:** Use um navegador moderno
- Chrome, Firefox, Edge ou Safari atualizados

---

## 💡 Dicas

1. **Teste em diferentes navegadores**
   - Chrome, Firefox, Edge, Safari

2. **Teste em diferentes tamanhos de tela**
   - Desktop (> 1024px)
   - Tablet (768px - 1024px)
   - Mobile (< 768px)

3. **Teste todas as funcionalidades**
   - Não apenas visualize, interaja!
   - Clique em tudo
   - Preencha formulários
   - Teste navegação por teclado

4. **Anote problemas**
   - Se encontrar algo estranho, anote
   - Tire screenshots se necessário

---

## 🚀 Próximo Passo

Depois de testar e aprovar:

1. Siga o guia em **`README-DEPLOY.md`**
2. Coloque online no Netlify (3 passos simples)
3. Compartilhe com o mundo! 🌍

---

## 🆘 Precisa de Ajuda?

- Veja `README-DEPLOY.md` para deploy online
- Veja `DEPLOY.md` para guia completo
- Veja `DESENVOLVIMENTO.md` para desenvolvimento local

---

**Divirta-se testando!** 🎉
