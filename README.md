# Welcome to your Lovable project

**URL**: http://localhost:8080

## Project info

**URL**: https://lovable.dev/projects/fa9e69d7-90b8-492d-8ebf-a9ccdd7d2a36

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/fa9e69d7-90b8-492d-8ebf-a9ccdd7d2a36) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/fa9e69d7-90b8-492d-8ebf-a9ccdd7d2a36) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Notes for local builds and Yii2 API wiring

- Running `npm run build` may show a Browserslist warning about an out-of-date `caniuse-lite` dataset. This is informational; the build still succeeds. If you want to silence it locally, run `npx update-browserslist-db@latest`.
- The front-end assumes your Yii2 auth endpoints exist at `/auth/login` and `/auth/register` (or the same paths under the host defined in `VITE_API_BASE_URL`). Until those backend routes are implemented, POST requests to them will return `404` even though the front-end code and token handling are already wired.
- You can change the base API host by setting `VITE_API_BASE_URL` in `.env.development` / `.env.production`; the shared `apiFetch` helper in `src/api/client.ts` prepends this value to all requests.

## Where the Yii2 auth integration lives

If you are looking for the Yii2-oriented changes that add bearer-token handling and the login/register flow, the key files are:

- `src/api/client.ts` — shared `apiFetch` helper that attaches the stored bearer token to each request.
- `src/api/auth.ts` — typed Yii2 auth endpoints for login and registration built on top of `apiFetch`.
- `src/api/hooks/useLogin.ts` and `src/api/hooks/useRegister.ts` — React Query hooks that call the auth endpoints and return mutations for UI usage.
- `src/features/auth/LoginForm.tsx` — reusable login form that triggers the hooks and surfaces validation and toast feedback.
- `src/pages/Auth.tsx` — auth page wiring the form and handling navigation after success.
- `src/contexts/AuthContext.tsx` — stores user data and bearer token in `localStorage`, exposes helpers like `isAuthenticated` and role checks, and supplies the token to `apiFetch`.

All of these are already committed on the `work` branch in this repository; you can inspect or modify them directly in the paths above.

## Example Yii2 urlManager rules for SPA routing

When serving the built React front-end from Yii2, configure `urlManager` so every SPA route returns the same controller action that renders the React bundle (for example, `SiteController::actionIndex`). Keep API endpoints under a separate prefix to avoid clashes:

```php
'components' => [
    'urlManager' => [
        'enablePrettyUrl' => true,
        'showScriptName' => false,
        'rules' => [
            // API endpoints
            'GET,POST api/<controller>/<action>' => 'api/<controller>/<action>',

            // Static assets (if needed)
            ['pattern' => 'assets/<file:.*>', 'route' => 'site/assets'],

            // Catch-all for SPA routes; adjust action if you render React elsewhere
            [
                'pattern' => '<path:.+>',
                'route' => 'site/index',
                'defaults' => ['path' => ''],
            ],
            '' => 'site/index',
        ],
    ],
],
```

The catch-all rule ensures direct navigation to routes like `/auth`, `/companies/123`, or `/tasks` is handled by Yii2 but still loads the React application, while API requests continue to hit dedicated controllers.

## How to call Yii2 REST endpoints from the React/TypeScript frontend

If you are not familiar with React or TypeScript, start by adding a tiny API helper and then use it inside components/hooks. The example below assumes your Yii2 API is available under `/api` (configure the exact host in `.env`).

1. **Expose the API base URL via Vite env.**
   - Create `.env.development` / `.env.production` with `VITE_API_BASE_URL=https://your-domain/api`.
   - Restart `npm run dev` after changing env files.

2. **Add a small typed HTTP helper** (e.g., `src/api/client.ts`):

   ```ts
   // src/api/client.ts
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

   export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
     const res = await fetch(`${API_BASE_URL}${path}`, {
       headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
       credentials: 'include', // keep if you use Yii2 cookies; remove if you use bearer tokens
       ...options,
     });

     if (!res.ok) {
       const message = await res.text();
       throw new Error(message || `Request failed with status ${res.status}`);
     }

     return res.json() as Promise<T>;
   }
   ```

3. **Wrap specific Yii2 endpoints** in a service file (e.g., `src/api/auth.ts`):

   ```ts
   // src/api/auth.ts
   import { apiFetch } from './client';

   export type LoginRequest = { username: string; password: string };
   export type LoginResponse = { token: string; user: { id: number; username: string } };

   export function login(payload: LoginRequest) {
     return apiFetch<LoginResponse>('/auth/login', {
       method: 'POST',
       body: JSON.stringify(payload),
     });
   }
   ```

4. **Use React Query to call the endpoint with built-in loading/error states** (keep using existing providers in `App.tsx`):

   ```ts
   // example inside a component or hook
   import { useMutation } from '@tanstack/react-query';
   import { login } from '@/api/auth';

   export function useLogin() {
     return useMutation({ mutationFn: login });
   }
   ```

5. **Call the hook from a form component** (simple example without extra UI libs):

   _Куда вставлять_: создайте новый компонент `LoginForm` (например, `src/features/auth/LoginForm.tsx`) и импортируйте его на страницу/маршрут авторизации. Если у вас уже есть страница логина, добавьте компонент туда.

   ```tsx
   import { FormEvent, useState } from 'react';
   import { useLogin } from '@/api/hooks/useLogin';

   export function LoginForm() {
     const [username, setUsername] = useState('');
     const [password, setPassword] = useState('');
     const login = useLogin();

     const onSubmit = (e: FormEvent) => {
       e.preventDefault();
       login.mutate({ username, password });
     };

     return (
       <form onSubmit={onSubmit}>
         <input value={username} onChange={(e) => setUsername(e.target.value)} />
         <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
         <button type="submit" disabled={login.isLoading}>Log in</button>
         {login.isError && <p>{(login.error as Error).message}</p>}
       </form>
     );
   }
   ```

6. **For bearer-token auth**, store the token after login and send it in headers:

   _Файлы:_
   - `src/api/client.ts` — создайте файл, если его нет, и храните в нём `apiFetch`.
   - компонент/хук логина (например, `src/features/auth/LoginForm.tsx` или `src/api/hooks/useLogin.ts`).


   ```ts
   // set once after login succeeds
   localStorage.setItem('accessToken', token);

   // update apiFetch to include it
   const token = localStorage.getItem('accessToken');
   const authHeader = token ? { Authorization: `Bearer ${token}` } : {};
   fetch(`${API_BASE_URL}${path}`, { headers: { ...authHeader, ... } });
   ```

   _Куда вставлять_: добавьте логику сохранения токена в обработчик успеха мутации логина (например, `login.mutate` в компоненте/хуке). Обновление `apiFetch` делайте прямо в `src/api/client.ts`, чтобы заголовок `Authorization` автоматически добавлялся во все дальнейшие запросы.

This flow keeps Yii2 responsible for REST endpoints (login, CRUD, etc.) while React handles forms and state. The TypeScript typings (`LoginRequest`, `LoginResponse`) mirror your Yii2 DTOs and make frontend usage clearer even if you are new to React.