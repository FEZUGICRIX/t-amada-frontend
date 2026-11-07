# T-AMADA frontend

Frontend сервиса составного бронирования путешествий.

## Требования

- Node.js 24
- pnpm 12.18.0

Версия pnpm зафиксирована в поле `packageManager` файла `package.json`.

## Установка и запуск

```bash
corepack enable
pnpm install
pnpm dev
```

## Команды

- `pnpm dev` — запустить dev-сервер;
- `pnpm test` — запустить тесты в watch-режиме;
- `pnpm test:run` — выполнить тесты один раз;
- `pnpm lint` — проверить код ESLint;
- `pnpm format` — отформатировать файлы Prettier;
- `pnpm format:check` — проверить форматирование;
- `pnpm build` — собрать production-версию;
- `pnpm check` — выполнить все проверки проекта.

## Импорты

Alias `@/*` указывает на директорию `src`:

```ts
import App from '@/app/App'
```
