# Guia de Testes de Propriedade

Este documento lista todas as propriedades de corretude que devem ser testadas usando property-based testing com fast-check.

## O que são Testes de Propriedade?

Testes de propriedade verificam que certas características ou comportamentos se mantêm verdadeiros para **todas** as entradas válidas, não apenas para exemplos específicos.

Exemplo:
- **Teste Unitário**: "Para o evento X, o mapa deve ter 1 marcador"
- **Teste de Propriedade**: "Para qualquer lista de N eventos, o mapa deve ter N marcadores"

## Propriedades a Serem Testadas

### Property 1: Mapa reflete eventos corretamente
**Arquivo:** `src/components/MapComponent.test.tsx`  
**Valida:** Requirements 1.2, 1.5

```typescript
// Feature: monitoramento-interdicoes-combustiveis, Property 1: Mapa reflete eventos corretamente
test('map markers count equals events count', () => {
  fc.assert(
    fc.property(fc.array(eventArbitrary), (events) => {
      const { container } = render(<MapComponent events={events} />);
      const markers = container.querySelectorAll('.leaflet-marker-icon');
      return markers.length === events.length;
    }),
    { numRuns: 100 }
  );
});
```

### Property 2: Popup exibe detalhes corretos do evento
**Arquivo:** `src/components/MapComponent.test.tsx`  
**Valida:** Requirements 1.3

```typescript
// Feature: monitoramento-interdicoes-combustiveis, Property 2: Popup exibe detalhes corretos do evento
test('popup contains correct event details', () => {
  fc.assert(
    fc.property(eventArbitrary, (event) => {
      const { container } = render(<MapComponent events={[event]} />);
      // Click marker to open popup
      const marker = container.querySelector('.leaflet-marker-icon');
      fireEvent.click(marker!);
      
      const popup = container.querySelector('.leaflet-popup-content');
      const popupText = popup?.textContent || '';
      
      return (
        popupText.includes(event.cidade) &&
        popupText.includes(event.uf) &&
        popupText.includes(event.local) &&
        popupText.includes(event.observacao)
      );
    }),
    { numRuns: 100 }
  );
});
```

### Property 3: Dashboard mantém invariante de agregação
**Arquivo:** `src/components/DashboardComponent.test.tsx`  
**Valida:** Requirements 2.1, 2.2

```typescript
// Feature: monitoramento-interdicoes-combustiveis, Property 3: Dashboard mantém invariante de agregação
test('sum of state counts equals total events', () => {
  fc.assert(
    fc.property(fc.array(eventArbitrary), (events) => {
      const { container } = render(<DashboardComponent events={events} />);
      
      // Extract total from UI
      const totalElement = container.querySelector('[data-testid="total-events"]');
      const total = parseInt(totalElement?.textContent || '0');
      
      // Extract state counts from UI
      const stateElements = container.querySelectorAll('[data-testid="state-count"]');
      const sumOfStates = Array.from(stateElements).reduce((sum, el) => {
        return sum + parseInt(el.textContent || '0');
      }, 0);
      
      return total === events.length && sumOfStates === total;
    }),
    { numRuns: 100 }
  );
});
```

### Property 4: Dashboard atualiza com mudanças de estado
**Arquivo:** `src/components/DashboardComponent.test.tsx`  
**Valida:** Requirements 2.3

```typescript
// Feature: monitoramento-interdicoes-combustiveis, Property 4: Dashboard atualiza com mudanças de estado
test('dashboard updates when events change', () => {
  fc.assert(
    fc.property(
      fc.array(eventArbitrary),
      fc.array(eventArbitrary),
      (events1, events2) => {
        const { rerender, container } = render(<DashboardComponent events={events1} />);
        const total1 = parseInt(container.querySelector('[data-testid="total-events"]')?.textContent || '0');
        
        rerender(<DashboardComponent events={events2} />);
        const total2 = parseInt(container.querySelector('[data-testid="total-events"]')?.textContent || '0');
        
        return total1 === events1.length && total2 === events2.length;
      }
    ),
    { numRuns: 100 }
  );
});
```

### Property 5: Estados ordenados decrescentemente
**Arquivo:** `src/components/DashboardComponent.test.tsx`  
**Valida:** Requirements 2.4

```typescript
// Feature: monitoramento-interdicoes-combustiveis, Property 5: Estados ordenados decrescentemente
test('states are sorted by count descending', () => {
  fc.assert(
    fc.property(fc.array(eventArbitrary, { minLength: 2 }), (events) => {
      const { container } = render(<DashboardComponent events={events} />);
      
      const stateCounts = Array.from(container.querySelectorAll('[data-testid="state-count"]'))
        .map(el => parseInt(el.textContent || '0'));
      
      // Check if sorted descending
      for (let i = 0; i < stateCounts.length - 1; i++) {
        if (stateCounts[i] < stateCounts[i + 1]) {
          return false;
        }
      }
      return true;
    }),
    { numRuns: 100 }
  );
});
```

### Property 6: Tabela reflete todos os eventos
**Arquivo:** `src/components/EventTableComponent.test.tsx`  
**Valida:** Requirements 3.2, 3.3

```typescript
// Feature: monitoramento-interdicoes-combustiveis, Property 6: Tabela reflete todos os eventos
test('table rows count equals events count', () => {
  fc.assert(
    fc.property(fc.array(eventArbitrary), (events) => {
      const { container } = render(<EventTableComponent events={events} />);
      const rows = container.querySelectorAll('tbody tr');
      return rows.length === events.length;
    }),
    { numRuns: 100 }
  );
});
```

### Property 7: Formatação de data consistente
**Arquivo:** `src/components/EventTableComponent.test.tsx`  
**Valida:** Requirements 3.4

```typescript
// Feature: monitoramento-interdicoes-combustiveis, Property 7: Formatação de data consistente
test('date is formatted as DD/MM/YYYY HH:mm', () => {
  fc.assert(
    fc.property(eventArbitrary, (event) => {
      const { container } = render(<EventTableComponent events={[event]} />);
      const dateCell = container.querySelector('tbody tr td:last-child');
      const dateText = dateCell?.textContent || '';
      
      // Check format: DD/MM/YYYY HH:mm
      const dateRegex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/;
      return dateRegex.test(dateText);
    }),
    { numRuns: 100 }
  );
});
```

### Property 8: Parsing JSON é round-trip
**Arquivo:** `src/types/index.test.ts`  
**Valida:** Requirements 4.2

```typescript
// Feature: monitoramento-interdicoes-combustiveis, Property 8: Parsing JSON é round-trip
test('JSON parse and stringify are round-trip', () => {
  fc.assert(
    fc.property(eventArbitrary, (event) => {
      const json = JSON.stringify(event);
      const parsed = JSON.parse(json);
      return JSON.stringify(parsed) === json;
    }),
    { numRuns: 100 }
  );
});
```

### Property 9: Erros de API geram mensagens
**Arquivo:** `src/services/APIService.test.ts`  
**Valida:** Requirements 4.3

```typescript
// Feature: monitoramento-interdicoes-combustiveis, Property 9: Erros de API geram mensagens
test('API errors generate user-friendly messages', () => {
  fc.assert(
    fc.property(
      fc.integer({ min: 400, max: 599 }),
      async (statusCode) => {
        // Mock axios to return error
        const mockError = { response: { status: statusCode } };
        jest.spyOn(axios, 'get').mockRejectedValue(mockError);
        
        const apiService = new APIService('http://test.com');
        const response = await apiService.getEvents();
        
        return !response.success && response.error !== undefined;
      }
    ),
    { numRuns: 100 }
  );
});
```

### Property 10: Submissão válida envia POST
**Arquivo:** `src/components/ReportFormModal.test.tsx`  
**Valida:** Requirements 5.4

```typescript
// Feature: monitoramento-interdicoes-combustiveis, Property 10: Submissão válida envia POST
test('valid submission sends POST request', () => {
  fc.assert(
    fc.property(newEventDataArbitrary, async (data) => {
      const onSubmit = jest.fn().mockResolvedValue(undefined);
      const { getByLabelText, getByText } = render(
        <ReportFormModal isOpen={true} onClose={() => {}} onSubmit={onSubmit} />
      );
      
      // Fill form
      fireEvent.change(getByLabelText(/cidade/i), { target: { value: data.cidade } });
      fireEvent.change(getByLabelText(/uf/i), { target: { value: data.uf } });
      fireEvent.change(getByLabelText(/local/i), { target: { value: data.local } });
      fireEvent.change(getByLabelText(/observação/i), { target: { value: data.observacao } });
      
      // Submit
      fireEvent.click(getByText(/reportar evento/i));
      
      await waitFor(() => expect(onSubmit).toHaveBeenCalledWith(data));
      return true;
    }),
    { numRuns: 100 }
  );
});
```

### Property 16: Validação rejeita dados inválidos
**Arquivo:** `src/utils/validation.test.ts`  
**Valida:** Requirements 9.1, 9.2

```typescript
// Feature: monitoramento-interdicoes-combustiveis, Property 16: Validação rejeita dados inválidos
test('validation rejects invalid data', () => {
  fc.assert(
    fc.property(invalidNewEventDataArbitrary, (data) => {
      const result = validateFormData(data);
      return !result.isValid && Object.keys(result.errors).length > 0;
    }),
    { numRuns: 100 }
  );
});
```

## Geradores fast-check

### eventArbitrary
```typescript
const eventArbitrary = fc.record({
  id: fc.uuid(),
  cidade: fc.string({ minLength: 1, maxLength: 100 }),
  uf: fc.constantFrom(...VALID_UF_LIST),
  local: fc.string({ minLength: 1, maxLength: 200 }),
  observacao: fc.string({ minLength: 1, maxLength: 500 }),
  latitude: fc.double({ min: -33.75, max: 5.27 }),
  longitude: fc.double({ min: -73.99, max: -34.79 }),
  dataAtualizacao: fc.date().map(d => d.toISOString())
});
```

### newEventDataArbitrary
```typescript
const newEventDataArbitrary = fc.record({
  cidade: fc.string({ minLength: 1, maxLength: 100 }),
  uf: fc.constantFrom(...VALID_UF_LIST),
  local: fc.string({ minLength: 1, maxLength: 200 }),
  observacao: fc.string({ minLength: 1, maxLength: 500 })
});
```

### invalidNewEventDataArbitrary
```typescript
const invalidNewEventDataArbitrary = fc.oneof(
  // Empty cidade
  fc.record({
    cidade: fc.constant(''),
    uf: fc.constantFrom(...VALID_UF_LIST),
    local: fc.string({ minLength: 1 }),
    observacao: fc.string({ minLength: 1 })
  }),
  // Empty uf
  fc.record({
    cidade: fc.string({ minLength: 1 }),
    uf: fc.constant(''),
    local: fc.string({ minLength: 1 }),
    observacao: fc.string({ minLength: 1 })
  }),
  // Invalid uf
  fc.record({
    cidade: fc.string({ minLength: 1 }),
    uf: fc.string({ minLength: 3 }), // More than 2 chars
    local: fc.string({ minLength: 1 }),
    observacao: fc.string({ minLength: 1 })
  }),
  // Empty local
  fc.record({
    cidade: fc.string({ minLength: 1 }),
    uf: fc.constantFrom(...VALID_UF_LIST),
    local: fc.constant(''),
    observacao: fc.string({ minLength: 1 })
  }),
  // Empty observacao
  fc.record({
    cidade: fc.string({ minLength: 1 }),
    uf: fc.constantFrom(...VALID_UF_LIST),
    local: fc.string({ minLength: 1 }),
    observacao: fc.constant('')
  })
);
```

## Configuração de Testes

### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.ts',
        '**/*.test.tsx',
      ],
    },
  },
});
```

### src/test/setup.ts
```typescript
import '@testing-library/jest-dom';
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

## Executar Testes

```bash
# Executar todos os testes
npm run test

# Executar em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

## Métricas de Qualidade

### Objetivos
- **Cobertura de código:** mínimo 80%
- **Cobertura de propriedades:** 100% das propriedades do design
- **Cobertura de branches:** mínimo 75%
- **Iterações por propriedade:** mínimo 100

### Verificar Cobertura
```bash
npm run test:coverage
```

Abra `coverage/index.html` no navegador para ver relatório detalhado.

## Boas Práticas

### 1. Geradores Inteligentes
Crie geradores que produzam dados realistas:
```typescript
// ❌ Ruim: gera strings aleatórias
fc.string()

// ✅ Bom: gera cidades brasileiras realistas
fc.constantFrom('São Paulo', 'Rio de Janeiro', 'Belo Horizonte', ...)
```

### 2. Propriedades Simples
Mantenha propriedades simples e focadas:
```typescript
// ❌ Ruim: testa múltiplas coisas
test('component works correctly', ...)

// ✅ Bom: testa uma propriedade específica
test('marker count equals event count', ...)
```

### 3. Shrinking
fast-check automaticamente encontra o menor caso de falha:
```typescript
// Se falhar com array de 100 eventos,
// fast-check tentará encontrar o menor array que falha
```

### 4. Seed para Reproduzibilidade
```typescript
fc.assert(
  fc.property(...),
  { numRuns: 100, seed: 42 } // Usa seed fixo para reproduzir falhas
);
```

## Troubleshooting

### Testes Lentos
- Reduza `numRuns` durante desenvolvimento
- Use `fc.sample()` para debug de geradores

### Falhas Intermitentes
- Use seed fixo para reproduzir
- Verifique se há estado compartilhado entre testes

### Geradores Inválidos
- Use `fc.sample(arbitrary, { numValues: 10 })` para inspecionar valores gerados
- Adicione constraints aos geradores

## Recursos

- [fast-check Documentation](https://github.com/dubzzz/fast-check)
- [Property-Based Testing Guide](https://fsharpforfunandprofit.com/posts/property-based-testing/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest](https://vitest.dev/)
