# FIRE-FORCE — Frontend

Frontend do FIRE-FORCE, um sistema de gestão financeira. Feito em Angular 21 sobre o template Sakai-NG (PrimeNG + Tailwind).

## Pré-requisitos

- Node 20+ (recomendado o LTS)
- npm 10+
- Angular CLI 21 (`npm i -g @angular/cli`)

## Instalação

```bash
npm install
```

## Rodando em modo dev

```bash
npm start
```

Sobe o servidor em `http://localhost:4200/`. Hot reload funciona por padrão — salvou um arquivo, a página atualiza.

## Build

```bash
npm run build
```

A saída fica em `dist/`. Para build de produção, o CLI já aplica as otimizações.

Se preferir um build contínuo enquanto desenvolve:

```bash
npm run watch
```

## Testes

```bash
npm test
```

Roda a suíte com Karma + Jasmine.

## Geração de código

Pra criar componentes, serviços, etc. com o CLI:

```bash
ng generate component nome-do-componente
ng generate service nome-do-servico
```

Lista completa dos schematics:

```bash
ng generate --help
```

## Formatação

Antes de subir mudança, vale rodar:

```bash
npm run format
```

Usa Prettier nas extensões padrão do projeto.

## Estrutura

- `src/app` — código da aplicação
- `src/assets` — imagens, ícones, estilos estáticos
- `src/environments` — configs por ambiente

## Backend

O backend fica em `../` (serviços Java/Gradle, ex.: `account-service`). O frontend consome essas APIs — confira o `environment.ts` pra apontar pra URL certa antes de rodar.
