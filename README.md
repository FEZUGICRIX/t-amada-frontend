# T-AMADA frontend

Клиентская часть сервиса составного бронирования путешествий.

## Стек

- React 19;
- TypeScript;
- Vite;
- Tailwind CSS 4;
- Vitest и React Testing Library.

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

- `pnpm dev` — запустить сервер разработки;
- `pnpm test` — запустить тесты в режиме наблюдения;
- `pnpm test:run` — выполнить тесты один раз;
- `pnpm lint` — проверить код ESLint;
- `pnpm format` — отформатировать файлы Prettier;
- `pnpm format:check` — проверить форматирование;
- `pnpm build` — собрать версию для публикации;
- `pnpm check` — выполнить все проверки проекта.

## Импорты

Псевдоним `@/*` указывает на папку `src`:

```ts
import App from '@/app/App'
```
