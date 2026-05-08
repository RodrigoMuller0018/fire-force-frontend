import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

// interceptor funcional: roda em toda chamada HTTP da app
// adiciona "Authorization: Bearer <token>" quando o user tá logado
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.token();

  // sem token, deixa o request passar como veio (rotas públicas tipo /auth/login)
  if (!token) {
    return next(req);
  }

  // clona o request adicionando o header Authorization
  // (HttpRequest é imutável — sempre clonar pra modificar)
  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` },
  });

  return next(authReq);
};
