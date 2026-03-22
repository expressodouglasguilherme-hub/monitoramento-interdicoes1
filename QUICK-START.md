# Quick Start Guide

Guia rápido para começar a usar o sistema de monitoramento.

## 🚀 Início Rápido (3 passos)

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar Mock Server (Terminal 1)
```bash
npm run mock-server
```

Você verá:
```
Mock API Server running on http://localhost:3000
API endpoints:
  GET  http://localhost:3000/api/events
  POST http://localhost:3000/api/events
```

### 3. Iniciar Frontend (Terminal 2)
```bash
npm run dev
```

Você verá:
```
VITE v5.0.8  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 4. Acessar o Sistema
Abra seu navegador em: **http://localhost:5173**

## 🎯 O que você verá

### Tela Principal
- **Header azul** com título e botão "REPORTAR NOVO PONTO"
- **Mapa interativo** do Brasil com marcadores de eventos
- **Dashboard** com total de eventos e gráfico de barras
- **Tabela** com detalhes de todos os eventos

### Funcionalidades Disponíveis

#### 1. Visualizar Eventos
- Veja eventos no mapa, dashboard e tabela
- Clique em marcadores no mapa para ver detalhes
- Observe o gráfico de distribuição por estado

#### 2. Reportar Novo Evento
- Clique no botão "REPORTAR NOVO PONTO"
- Preencha o formulário:
  - **Cidade**: Ex: São Paulo
  - **UF**: Ex: SP (2 letras)
  - **Local**: Ex: Rodovia Anhanguera, km 50
  - **Observação**: Descreva o evento
- Clique em "Reportar Evento"
- Veja a confirmação de sucesso

#### 3. Atualização Automática
- O sistema atualiza automaticamente a cada 30 segundos
- Novos eventos aparecem no mapa, dashboard e tabela

## 🧪 Testar Validação

Tente reportar um evento com dados inválidos:

### UF Inválida
- Digite "XX" no campo UF
- Veja a mensagem: "UF deve ser uma sigla válida de estado brasileiro"

### Campos Vazios
- Deixe um campo vazio
- Veja a mensagem: "O campo [nome] é obrigatório"

### Botão Desabilitado
- Com erros de validação, o botão "Reportar Evento" fica desabilitado

## 📱 Testar Responsividade

### Desktop (> 1024px)
- Layout em 2 colunas
- Mapa à esquerda (altura total)
- Dashboard e tabela à direita (empilhados)

### Tablet (768px - 1024px)
- Layout em 1 coluna
- Componentes empilhados

### Mobile (< 768px)
- Layout em 1 coluna
- Componentes empilhados
- Header com botão abaixo do título

## ⌨️ Testar Acessibilidade

### Navegação por Teclado
1. Pressione **Tab** para navegar entre elementos
2. Pressione **Enter** ou **Space** para ativar botões
3. No modal, pressione **ESC** para fechar

### Indicadores de Foco
- Observe o outline azul ao focar elementos
- Todos os elementos interativos devem ser focáveis

## 🔧 Troubleshooting

### Porta 3000 já em uso
```bash
# Edite mock-server.js e altere:
const PORT = 3001; // ou outra porta disponível

# Depois atualize .env:
VITE_API_BASE_URL=http://localhost:3001/api
```

### Mapa não carrega
- Verifique sua conexão com a internet
- O mapa usa tiles do OpenStreetMap (requer internet)

### Erro de CORS
- Certifique-se de que o mock server está rodando
- Verifique se a URL no `.env` está correta

### Componentes não aparecem
- Verifique o console do navegador (F12)
- Certifique-se de que ambos os servidores estão rodando

## 📚 Próximos Passos

### Explorar o Código
- `src/components/` - Componentes React
- `src/context/` - Gerenciamento de estado
- `src/services/` - Camada de API
- `src/utils/` - Utilitários (validação)

### Ler Documentação
- `DESENVOLVIMENTO.md` - Guia completo de desenvolvimento
- `src/components/README.md` - Documentação dos componentes
- `TASK-6-15-SUMMARY.md` - Resumo da implementação

### Executar Testes
```bash
npm run test
```

### Ver Cobertura de Testes
```bash
npm run test:coverage
```

## 🎨 Personalizar

### Cores
Edite `tailwind.config.js` para alterar a paleta de cores.

### API Backend
Edite `.env` para apontar para uma API real:
```env
VITE_API_BASE_URL=https://api.exemplo.com/api
```

### Intervalo de Polling
Edite `src/context/EventContext.tsx`:
```typescript
const pollingInterval = 60000; // 60 segundos
```

## ✅ Checklist de Funcionalidades

- [ ] Visualizar eventos no mapa
- [ ] Clicar em marcadores e ver popups
- [ ] Ver métricas no dashboard
- [ ] Ver gráfico de barras
- [ ] Ver tabela de eventos
- [ ] Abrir modal de reportar evento
- [ ] Preencher formulário
- [ ] Ver validação em tempo real
- [ ] Submeter evento com sucesso
- [ ] Ver novo evento aparecer após polling
- [ ] Testar responsividade (redimensionar janela)
- [ ] Testar navegação por teclado
- [ ] Testar fechamento de modal com ESC

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs no console do navegador (F12)
2. Verifique os logs do mock server no terminal
3. Consulte `DESENVOLVIMENTO.md` para troubleshooting
4. Revise a documentação em `.kiro/specs/`

---

**Pronto!** Você está pronto para usar e desenvolver o sistema de monitoramento. 🎉
