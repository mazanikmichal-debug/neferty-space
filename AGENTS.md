# Project Guidance

## User Preferences

[No preferences yet]

## Verified Commands

**Frontend** (run from `src/frontend/`):

- **install**: `pnpm install --prefer-offline`
- **typecheck**: `pnpm typecheck`
- **lint fix**: `pnpm fix`
- **build**: `pnpm build`

**Backend** (run from `src/backend/`):

- **install**: `mops install`
- **typecheck**: `mops check --fix`
- **build**: `mops build`

**Backend and frontend integration** (run from root):

- **generate bindings**: `pnpm bindgen` This step is necessary to ensure the frontend can call the backend methods.

## Learnings

- `react-router-dom` is NOT installed; use `@tanstack/react-router` for all routing.
- TanStack Router: `createBrowserHistory`, `createRouter`, `RouterProvider`, `createRootRoute`, `createRoute`, `Outlet`, `Link`, `useNavigate`, `useRouterState`.
- TanStack Router `useNavigate()` takes `{ to, replace }` object, not `(path, options)`.
- TanStack Router `useRouterState` pathname: `useRouterState({ select: (s) => s.location.pathname })`.
