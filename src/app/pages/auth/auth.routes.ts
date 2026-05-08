import { Routes } from '@angular/router';
import { Login } from './login';
import { Register } from './register';

// rotas públicas de autenticação
export default [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
] as Routes;
