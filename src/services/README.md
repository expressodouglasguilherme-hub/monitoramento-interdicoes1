# Services Layer

## APIService

Classe responsável por toda comunicação HTTP com o backend da aplicação.

### Características

- **Timeout**: 10 segundos para todas as requisições
- **Retry Logic**: Até 3 tentativas com backoff exponencial (1s, 2s, 4s)
- **Interceptors**: Logging automático de requisições e respostas
- **Error Handling**: Mensagens de erro amigáveis em português

### Uso

```typescript
import { APIService } from './services/APIService';

// Inicializar o serviço
const apiService = new APIService('https://api.example.com');

// Buscar eventos
const response = await apiService.getEvents();
if (response.success) {
  console.log('Eventos:', response.data);
} else {
  console.error('Erro:', response.error);
}

// Criar novo evento
const newEvent = {
  cidade: 'São Paulo',
  uf: 'SP',
  local: 'Rodovia Anhanguera',
  observacao: 'Interdição parcial'
};

const createResponse = await apiService.createEvent(newEvent);
if (createResponse.success) {
  console.log('Evento criado:', createResponse.data);
}
```

### Tratamento de Erros

O APIService categoriza erros HTTP e retorna mensagens apropriadas:

- **400**: "Dados inválidos. Verifique os campos e tente novamente."
- **401**: "Sessão expirada. Por favor, faça login novamente."
- **403**: "Você não tem permissão para realizar esta ação."
- **404**: "Recurso não encontrado."
- **500**: "Erro no servidor. Tente novamente em alguns instantes."
- **503**: "Serviço temporariamente indisponível. Tentando reconectar..."
- **Network Error**: "Não foi possível conectar ao servidor. Verifique sua conexão."

### Retry Logic

- **Erros 4xx**: Não faz retry (erros de cliente)
- **Erros 5xx**: Faz até 3 tentativas com backoff exponencial
- **Erros de rede**: Faz até 3 tentativas com backoff exponencial

### Requisitos Atendidos

- **4.1**: Requisições HTTP à API Backend
- **4.2**: Processamento de respostas JSON e interceptors para logging
- **4.3**: Tratamento de erros com mensagens amigáveis
- **4.5**: Retry automático para falhas de rede
- **5.4**: Submissão de novos eventos via POST
- **5.6**: Tratamento de erros de submissão

### Testes

Execute os testes unitários:

```bash
npm run test src/services/APIService.test.ts
```

Os testes cobrem:
- Configuração correta do Axios
- Requisições GET e POST
- Timeout de 10 segundos
- Retry logic (3 tentativas em erros 5xx)
- Tratamento de erros por status code
- Erros de rede
