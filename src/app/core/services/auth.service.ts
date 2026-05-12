import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { User } from '../models/user.model';
import { UserService } from './user.service';

// chaves usadas no localStorage pra persistir token + user entre reloads
const TOKEN_STORAGE_KEY = 'fire_force_token';
const USER_STORAGE_KEY = 'fire_force_user';

// informações decodificadas do JWT (iat, exp como Date) — útil pra tela de perfil
export interface TokenInfo {
  issuedAt: Date | null;
  expiresAt: Date | null;
  sub: string | null;
}

// serviço global de autenticação (singleton — providedIn: 'root')
@Injectable({ providedIn: 'root' })
export class AuthService {
  // injeta dependências
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly userService = inject(UserService);

  // signal que guarda o token JWT (null = deslogado) — inicial vem do localStorage
  private readonly tokenSignal = signal<string | null>(this.readTokenFromStorage());

  // signal que guarda o usuário atual — lido do localStorage (sobrevive a reload)
  // OBS: o JWT atual do backend só tem "sub" (uuid). Como name/email não estão no token,
  // a gente persiste o User separado no momento do login/cadastro.
  private readonly userSignal = signal<User | null>(this.readUserFromStorage());

  // expõe o token como read-only pra fora do serviço
  readonly token = this.tokenSignal.asReadonly();

  // expõe o usuário como read-only
  readonly user = this.userSignal.asReadonly();

  constructor() {
    // sanidade: se tem token mas não tem user salvo, o localStorage está num estado
    // inconsistente (ex: token de uma sessão antiga, antes da gente persistir user).
    // Limpa tudo silenciosamente — o authGuard redireciona pro /auth/login.
    if (this.tokenSignal() !== null && this.userSignal() === null) {
      this.tokenSignal.set(null);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }

  // computed: tá logado se tiver token
  readonly isLoggedIn = computed(() => this.tokenSignal() !== null);

  // computed: info do token decodificada (iat/exp como Date) — usado na tela de perfil
  readonly tokenInfo = computed<TokenInfo | null>(() => {
    const token = this.tokenSignal();
    if (!token) return null;
    const payload = this.decodeJwtPayload(token);
    if (!payload) return null;
    return {
      // iat/exp são Unix timestamps em segundos — convertendo pra ms
      issuedAt: payload['iat'] ? new Date((payload['iat'] as number) * 1000) : null,
      expiresAt: payload['exp'] ? new Date((payload['exp'] as number) * 1000) : null,
      sub: (payload['sub'] as string) ?? null,
    };
  });

  // faz login chamando POST /api/auth/login (proxy redireciona pro auth-service:8001)
  // backend retorna JSON: { code: string, message: string (JWT em sucesso), status: string }
  async login(email: string, password: string): Promise<boolean> {
    if (!email || !password) {
      return false;
    }

    try {
      const response = await firstValueFrom(
        this.http.post<{ code: string; message: string; status: string }>(
          '/api/auth/login',
          { email, password },
        ),
      );

      // em sucesso, o JWT vem dentro de "message". JWT sempre começa com "eyJ".
      const token = response?.message;
      if (!token || !token.startsWith('eyJ')) {
        return false;
      }

      // sucesso — guarda o token
      this.tokenSignal.set(token);
      this.persistToken(token);

      // monta o user com o que sabemos (sub do JWT + email digitado + nome derivado)
      // se já tinha name salvo (vindo do cadastro), preserva
      this.userService.get().subscribe((user) => {
        this.userSignal.set(user);
        this.persistUser(user);
      });

      // redireciona pra área logada (/ é o dashboard)
      this.router.navigate(['/']);
      return true;
    } catch {
      return false;
    }
  }

  // cadastra novo usuário e já loga em sequência
  // backend espera: { name, email, document, password }
  async signup(input: {
    name: string;
    email: string;
    document: string;
    password: string;
  }): Promise<{ ok: boolean; error?: string }> {
    try {
      // POST /api/auth → cria o usuário (proxy redireciona pro auth-service)
      await firstValueFrom(this.http.post('/api/auth', input));

      // pré-salva o name digitado pra o login() preservar
      // (login() não tem como descobrir o name a partir do JWT atual)
      this.userSignal.set({} as User); // placeholder vazio pra indicar que temos um name salvo

      // cadastrado com sucesso → loga automaticamente com as mesmas credenciais
      const loggedIn = await this.login(input.email, input.password);
      return {
        ok: loggedIn,
        error: loggedIn ? undefined : 'Cadastro feito mas login automático falhou',
      };
    } catch (err) {
      // backend retorna { code, message, status } em caso de erro de validação
      const httpErr = err as { error?: { message?: unknown } };
      const msg = httpErr?.error?.message;
      return {
        ok: false,
        error: typeof msg === 'string' ? msg : 'Erro ao cadastrar usuário',
      };
    }
  }

  // faz logout — limpa tudo e volta pra tela de login
  logout(): void {
    this.tokenSignal.set(null);
    this.userSignal.set(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    this.router.navigate(['/auth/login']);
  }

  // decodifica o payload (parte do meio) de um JWT
  // JWT tem formato: header.payload.signature (separados por ponto, base64)
  private decodeJwtPayload(token: string): Record<string, unknown> | null {
    try {
      const payloadBase64 = token.split('.')[1]; // pega a parte do meio
      const json = atob(payloadBase64); // decodifica de base64
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  // lê token persistido do localStorage (chamado no init do signal)
  private readTokenFromStorage(): string | null {
    if (typeof localStorage === 'undefined') return null; // SSR safety
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  // lê user persistido do localStorage (chamado no init do signal)
  private readUserFromStorage(): User | null {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  // persiste token no localStorage
  private persistToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }

  // persiste user no localStorage
  private persistUser(user: User): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }
}
