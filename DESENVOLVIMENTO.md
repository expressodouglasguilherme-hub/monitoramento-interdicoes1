# Guia de Desenvolvimento

Este documento fornece instruções para executar e desenvolver o sistema de monitoramento.

## Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

## Instalação

```bash
# Instalar dependências
npm install
```

## Executando o Sistema

### 1. Iniciar o Mock Server (Backend)

Em um terminal, execute:

```bash
npm run mock-server
```

O servidor mock estará disponível em `http://localhost:3000`

### 2. Iniciar o Frontend

Em outro terminal, execute:

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`

## Estrutura do Projeto

```
src/
├── components/          # Componentes React UI
│   ├── LoadingIndicator.tsx
│   ├── MapComponent.tsx
│   ├── DashboardComponent.tsx
│   ├── EventTableComponent.tsx
│   ├── ReportFormModal.tsx
│   └── index.ts
├── context/            # Context API para estado global
│   ├── EventContext.tsx
│   └── index.ts
├── services/           # Camada de serviço (API)
│   ├── APIService.ts
│   └── index.ts
├── types/              # Definições de tipos TypeScript
│   └── index.ts
├── utils/              # Utilitários (validação, etc)
│   ├── validation.ts
│   └── index.ts
├── App.tsx             # Componente principal
├── main.tsx            # Entry point
└── index.css           # Estilos globais
```

## Componentes Implementados

### LoadingIndicator
Indicador visual de carregamento com spinner animado.

### MapComponent
Mapa interativo do Brasil usando Leaflet com marcadores de eventos.

### DashboardComponent
Dashboard com métricas agregadas e gráfico de barras usando Chart.js.

### EventTableComponent
Tabela detalhada de eventos com formatação de data e scroll vertical.

### ReportFormModal
Modal com formulário para reportar novos eventos, incluindo validação em tempo real.

## Funcionalidades Implementadas

### ✅ Visualização de Eventos
- Mapa interativo centrado no Brasil
- Marcadores com popups de detalhes
- Dashboard com métricas agregadas
- Gráfico de barras (top 7 estados)
- Tabela detalhada com scroll

### ✅ Atualização em Tempo Real
- Polling automático a cada 30 segundos
- Reconnection logic após falhas
- Indicadores de loading

### ✅ Reportar Eventos
- Modal com formulário
- Validação em tempo real
- Mensagens de erro específicas
- Feedback de sucesso/erro

### ✅ Acessibilidade
- ARIA labels e roles
- Navegação por teclado
- Indicadores visuais de foco
- Textos alternativos

### ✅ Responsividade
- Layout adaptativo (mobile, tablet, desktop)
- Grid responsivo com Tailwind CSS

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento
npm run mock-server      # Inicia mock API server

# Build
npm run build            # Compila para produção
npm run preview          # Preview do build de produção

# Testes
npm run test             # Executa testes
npm run test:watch       # Executa testes em modo watch
npm run test:coverage    # Gera relatório de cobertura

# Linting
npm run lint             # Executa ESLint
```

## Mock API Server

O mock server simula o backend e fornece:

### GET /api/events
Retorna lista de eventos mock.

**Resposta:**
```json
[
  {
    "id": "1",
    "cidade": "São Paulo",
    "uf": "SP",
    "local": "Rodovia Anhanguera, km 50",
    "observacao": "Interdição parcial devido a acidente",
    "latitude": -23.5505,
    "longitude": -46.6333,
    "dataAtualizacao": "2024-01-15T10:30:00.000Z"
  }
]
```

### POST /api/events
Cria novo evento.

**Request Body:**
```json
{
  "cidade": "São Paulo",
  "uf": "SP",
  "local": "Rodovia Anhanguera, km 50",
  "observacao": "Interdição parcial devido a acidente"
}
```

**Resposta (201):**
```json
{
  "id": "6",
  "cidade": "São Paulo",
  "uf": "SP",
  "local": "Rodovia Anhanguera, km 50",
  "observacao": "Interdição parcial devido a acidente",
  "latitude": -23.5505,
  "longitude": -46.6333,
  "dataAtualizacao": "2024-01-15T10:30:00.000Z"
}
```

## Próximos Passos

### Testes Pendentes
- Testes unitários para todos os componentes
- Testes de propriedade (property-based testing)
- Testes de integração E2E

Veja `tasks.md` para lista completa de tarefas pendentes.

## Troubleshooting

### Porta 3000 já em uso
Se a porta 3000 estiver em uso, edite `mock-server.js` e altere a constante `PORT`.

### Erro de CORS
Certifique-se de que o mock server está rodando e que a URL no `.env` está correta.

### Mapa não carrega
Verifique se você tem conexão com a internet (necessário para tiles do OpenStreetMap).

## Suporte

Para dúvidas ou problemas, consulte:
- `README.md` - Visão geral do projeto
- `SETUP.md` - Instruções de configuração
- `.kiro/specs/monitoramento-interdicoes-combustiveis/` - Especificações técnicas
