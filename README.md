# Sistema de Monitoramento de Interdições e Combustíveis

Sistema web profissional e corporativo de monitoramento em tempo real de interdições rodoviárias e eventos relacionados ao abastecimento de combustíveis no Brasil.

## Tecnologias

- **React 18** com TypeScript
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework de estilização
- **Leaflet** - Mapas interativos
- **Chart.js** - Gráficos e dashboards
- **Axios** - Cliente HTTP
- **Vitest** - Framework de testes
- **fast-check** - Property-based testing

## Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## Instalação

### Frontend

```bash
# Instalar dependências
npm install

# ou com yarn
yarn install
```

### Backend (Power BI Scraper)

O sistema requer um backend Node.js que extrai dados do Power BI. Veja instruções completas em `backend/README.md`.

```bash
# Navegar para o diretório do backend
cd backend

# Instalar dependências
npm install

# Instalar navegadores do Playwright
npx playwright install chromium

# Copiar arquivo de ambiente
cp .env.example .env

# Editar .env com suas configurações
# Iniciar backend em modo desenvolvimento
npm run dev
```

O backend estará disponível em `http://localhost:3000`

## Scripts Disponíveis

### Frontend

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview

# Executar testes
npm run test

# Executar testes em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage

# Lint do código
npm run lint
```

### Backend

```bash
# Navegar para o diretório do backend
cd backend

# Modo desenvolvimento com hot reload
npm run dev

# Build TypeScript
npm run build

# Executar em produção
npm start
```

## Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── MapComponent/
│   ├── DashboardComponent/
│   ├── EventTableComponent/
│   ├── ReportFormModal/
│   └── LoadingIndicator/
├── context/            # Context API para gerenciamento de estado
│   └── EventContext/
├── services/           # Camada de serviço (API)
│   └── APIService/
├── types/              # Definições de tipos TypeScript
├── utils/              # Funções utilitárias
├── test/               # Configuração de testes
├── App.tsx             # Componente principal
├── main.tsx            # Entry point
└── index.css           # Estilos globais
```

## Funcionalidades

- ✅ Visualização de eventos em mapa interativo do Brasil
- ✅ Dashboard com métricas agregadas e gráficos
- ✅ Tabela detalhada de eventos
- ✅ Formulário para reportar novos eventos
- ✅ Atualização automática em tempo real (polling)
- ✅ Interface responsiva e acessível
- ✅ Validação de dados de entrada
- ✅ Tratamento robusto de erros

## Desenvolvimento

O projeto segue as melhores práticas de desenvolvimento:

- Type safety com TypeScript
- Testes unitários e property-based testing
- Componentes reutilizáveis e isolados
- Gerenciamento de estado com Context API
- Design responsivo com Tailwind CSS
- Acessibilidade (WCAG)

## Licença

Proprietary - Todos os direitos reservados

## 🚀 Deploy

### Frontend (GitHub Pages / Netlify)

Veja o guia completo: [DEPLOY.md](DEPLOY.md)

### Backend (Render.com)

O projeto inclui um backend completo com scraping do Power BI!

**Guias disponíveis:**
- 🚀 **Rápido (5 min)**: [DEPLOY-RAPIDO.md](DEPLOY-RAPIDO.md)
- 📖 **Completo**: [DEPLOY-RENDER.md](DEPLOY-RENDER.md)
- ✅ **Checklist**: [CHECKLIST-DEPLOY.md](CHECKLIST-DEPLOY.md)
- 💡 **Dicas**: [RENDER-TIPS.md](RENDER-TIPS.md)

**Resumo:**
1. Crie conta em https://render.com
2. Conecte seu repositório GitHub
3. Configure como Web Service (root: `backend`)
4. Deploy automático!
5. Copie a URL e configure no frontend

**Totalmente gratuito** ✨

