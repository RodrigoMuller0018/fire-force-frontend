import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

// rotas raiz da aplicação
// estrutura em 2 níveis:
//   1) rotas públicas (login, register) — sem layout, tela cheia
//   2) rotas privadas (dashboard, profile, etc) — dentro do ShellComponent (sidebar+topbar)
export const appRoutes: Routes = [
  // rotas públicas (sem layout)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () =>
          import('./features/register/register.component').then((m) => m.RegisterComponent),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },

  // área autenticada — tudo dentro do Shell (topbar + sidebar + outlet)
  {
    path: '',
    canActivate: [authGuard], // bloqueia se não logado (redireciona pra /auth/login)
    loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./features/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'carteira',
        loadComponent: () =>
          import('./features/wallet/list/wallet-list.component').then((m) => m.WalletListComponent),
      },
      {
        path: 'carteira/nova',
        loadComponent: () =>
          import('./features/wallet/form/wallet-form.component').then((m) => m.WalletFormComponent),
      },
      {
        path: 'carteira/editar/:uuid',
        loadComponent: () =>
          import('./features/wallet/form/wallet-form.component').then((m) => m.WalletFormComponent),
      },
      // futuras features (categorias, transações) entram aqui
    ],
  },

  // fallback: qualquer rota desconhecida → 404
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
