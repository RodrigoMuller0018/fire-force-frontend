import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Notfound } from './app/pages/notfound/notfound';
import { authGuard } from './app/core/guards/auth.guard';

// rotas raiz da aplicação
export const appRoutes: Routes = [
  // área autenticada — protegida pelo authGuard
  // (não logado → redireciona pra /auth/login)
  {
    path: '',
    component: AppLayout,
    canActivate: [authGuard],
    children: [
      { path: '', component: Dashboard }, // / → Dashboard
      // tela de perfil (read-only, lê do JWT)
      {
        path: 'perfil',
        loadComponent: () => import('./app/pages/profile/profile').then((m) => m.Profile),
      },
      // futuras: contas/transações/relatórios — vão entrar aqui conforme implementadas
    ],
  },

  // rotas públicas
  { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') }, // /auth/login, /auth/register
  { path: 'notfound', component: Notfound },

  // fallback
  { path: '**', redirectTo: '/notfound' },
];
