import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

// guard funcional que protege rotas privadas (Angular 21+ usa este formato)
// retorna true → libera; retorna UrlTree → redireciona
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // se logado, libera o acesso
  if (auth.isLoggedIn()) {
    return true;
  }

  // não logado → redireciona pro login
  return router.parseUrl('/auth/login');
};
