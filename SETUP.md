# Guia de Configuração do Projeto

## Status da Configuração

✅ Estrutura do projeto criada
✅ Arquivos de configuração criados
⏳ Dependências precisam ser instaladas

## Próximos Passos

### 1. Instalar Node.js

Se você ainda não tem o Node.js instalado, baixe e instale a versão LTS mais recente:
- **Windows/Mac/Linux**: https://nodejs.org/

Verifique a instalação:
```bash
node --version
npm --version
```

### 2. Instalar Dependências

No diretório raiz do projeto, execute:

```bash
npm install
```

Isso instalará todas as dependências listadas no `package.json`:

#### Dependências de Produção:
- `react` e `react-dom` - Framework React
- `react-leaflet` e `leaflet` - Mapas interativos
- `chart.js` e `react-chartjs-2` - Gráficos
- `axios` - Cliente HTTP

#### Dependências de Desenvolvimento:
- `vite` - Build tool
- `typescript` - Type checking
- `vitest` - Framework de testes
- `@testing-library/react` - Testes de componentes
- `fast-check` - Property-based testing
- `tailwindcss` - Framework CSS
- `eslint` - Linter

### 3. Iniciar o Servidor de Desenvolvimento

Após instalar as dependências:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:5173`

### 4. Executar Testes

```bash
# Executar todos os testes
npm run test

# Executar testes em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage
```

## Estrutura Criada

```
monitoramento-interdicoes-combustiveis/
├── .kiro/                          # Especificações do projeto
├── src/
│   ├── components/                 # Componentes React (vazio)
│   ├── context/                    # Context API (vazio)
│   ├── services/                   # Serviços API (vazio)
│   ├── types/                      # Tipos TypeScript (vazio)
│   ├── utils/                      # Utilitários (vazio)
│   ├── test/
│   │   └── setup.ts               # Configuração de testes
│   ├── App.tsx                    # Componente principal
│   ├── main.tsx                   # Entry point
│   ├── index.css                  # Estilos globais com Tailwind
│   └── vite-env.d.ts              # Tipos do Vite
├── index.html                      # HTML principal
├── package.json                    # Dependências e scripts
├── tsconfig.json                   # Configuração TypeScript
├── tsconfig.node.json              # Config TS para Node
├── vite.config.ts                  # Configuração Vite
├── vitest.config.ts                # Configuração Vitest
├── tailwind.config.js              # Configuração Tailwind
├── postcss.config.js               # Configuração PostCSS
├── .eslintrc.cjs                   # Configuração ESLint
├── .gitignore                      # Arquivos ignorados pelo Git
└── README.md                       # Documentação do projeto
```

## Configurações Importantes

### TypeScript
- Modo strict habilitado
- Target: ES2020
- JSX: react-jsx

### Tailwind CSS
- Paleta de cores corporativa configurada
- Suporte para dark mode (se necessário)
- Importação do CSS do Leaflet

### Vitest
- Ambiente: jsdom (para testes de componentes React)
- Globals habilitados
- Cobertura com v8
- Setup automático com @testing-library/jest-dom

### Vite
- Plugin React configurado
- Hot Module Replacement (HMR) habilitado
- Build otimizado para produção

## Verificação da Instalação

Após instalar as dependências, verifique se tudo está funcionando:

1. **Build do projeto**:
   ```bash
   npm run build
   ```

2. **Executar testes**:
   ```bash
   npm run test
   ```

3. **Lint do código**:
   ```bash
   npm run lint
   ```

Se todos os comandos executarem sem erros, a configuração está completa!

## Troubleshooting

### Erro: "Cannot find module"
- Execute `npm install` novamente
- Limpe o cache: `npm cache clean --force`

### Erro de TypeScript
- Verifique se o TypeScript está instalado: `npm list typescript`
- Reinstale: `npm install -D typescript`

### Erro do Vite
- Limpe a pasta `.vite`: `rm -rf node_modules/.vite`
- Reinicie o servidor de desenvolvimento

### Erro do Tailwind
- Verifique se o PostCSS está instalado
- Confirme que `index.css` importa as diretivas do Tailwind

## Próximas Tarefas

Após a instalação das dependências, as próximas tarefas do plano de implementação são:

1. ✅ **Tarefa 1**: Configurar estrutura do projeto e dependências (CONCLUÍDA)
2. ⏭️ **Tarefa 2**: Definir tipos e modelos de dados
3. ⏭️ **Tarefa 3**: Implementar camada de serviço (APIService)
4. ⏭️ **Tarefa 4**: Implementar Context API
5. ... (continua conforme tasks.md)
