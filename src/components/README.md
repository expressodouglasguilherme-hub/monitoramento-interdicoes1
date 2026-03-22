# Componentes UI

Este diretório contém todos os componentes React da interface do usuário do sistema de monitoramento.

## Componentes Implementados

### LoadingIndicator
**Arquivo:** `LoadingIndicator.tsx`  
**Requisitos:** 8.1, 8.2

Indicador visual de carregamento com spinner animado.

**Props:**
- `message?: string` - Mensagem opcional a ser exibida
- `size?: 'small' | 'medium' | 'large'` - Tamanho do indicador

**Uso:**
```tsx
<LoadingIndicator message="Carregando eventos..." size="large" />
```

### MapComponent
**Arquivo:** `MapComponent.tsx`  
**Requisitos:** 1.1, 1.2, 1.3, 1.4, 1.5, 7.4

Mapa interativo do Brasil com marcadores de eventos usando Leaflet.

**Props:**
- `events: Event[]` - Array de eventos a serem exibidos no mapa

**Funcionalidades:**
- Mapa centrado no Brasil
- Marcadores para cada evento
- Popups com detalhes ao clicar
- Preserva zoom e posição durante atualizações

**Uso:**
```tsx
<MapComponent events={events} />
```

### DashboardComponent
**Arquivo:** `DashboardComponent.tsx`  
**Requisitos:** 2.1, 2.2, 2.3, 2.4, 2.5, 6.1

Dashboard com métricas agregadas e gráfico de barras usando Chart.js.

**Props:**
- `events: Event[]` - Array de eventos para agregação

**Funcionalidades:**
- Total de eventos ativos
- Agregação por estado (UF)
- Gráfico de barras com top 7 estados
- Lista completa de distribuição por estado

**Uso:**
```tsx
<DashboardComponent events={events} />
```

### EventTableComponent
**Arquivo:** `EventTableComponent.tsx`  
**Requisitos:** 3.1, 3.2, 3.3, 3.4, 3.5, 7.5, 8.3

Tabela detalhada de eventos com scroll vertical.

**Props:**
- `events: Event[]` - Array de eventos a serem exibidos

**Funcionalidades:**
- Colunas: CIDADE, UF, LOCAL, OBSERVAÇÃO, ATUALIZAÇÃO
- Formatação de data (DD/MM/YYYY HH:mm)
- Scroll vertical para grandes volumes
- Animação de adição de novas linhas
- Mensagem quando não há eventos

**Uso:**
```tsx
<EventTableComponent events={events} />
```

### ReportFormModal
**Arquivo:** `ReportFormModal.tsx`  
**Requisitos:** 5.2, 5.3, 5.4, 5.5, 5.6, 9.3, 9.4, 9.5

Modal com formulário para reportar novos eventos.

**Props:**
- `isOpen: boolean` - Controla visibilidade do modal
- `onClose: () => void` - Callback para fechar o modal
- `onSubmit: (data: NewEventData) => Promise<void>` - Callback para submeter dados

**Funcionalidades:**
- Validação em tempo real de campos
- Mensagens de erro específicas por campo
- Botão submit desabilitado com erros
- Indicador de loading durante envio
- Mensagens de sucesso/erro
- Fecha com ESC ou clique fora
- Limpa formulário após sucesso

**Uso:**
```tsx
<ReportFormModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  onSubmit={reportNewEvent}
/>
```

## Acessibilidade

Todos os componentes implementam requisitos de acessibilidade:

- **ARIA labels** para elementos interativos
- **Navegação por teclado** (Tab, Enter, Space, ESC)
- **Indicadores visuais de foco** com outline/ring
- **Textos alternativos** para elementos visuais
- **Roles e atributos ARIA** apropriados
- **Contraste adequado** de cores
- **Tamanhos de fonte** mínimos (14px)

## Estilização

Todos os componentes usam **Tailwind CSS** para estilização consistente:

- Paleta de cores corporativa (azul primário)
- Design responsivo (mobile-first)
- Animações suaves
- Sombras e bordas arredondadas
- Estados hover e focus

## Testes

Cada componente deve ter:
- Testes unitários para casos específicos
- Testes de propriedade para comportamentos universais
- Cobertura de acessibilidade

Veja `tasks.md` para detalhes dos testes a serem implementados.
