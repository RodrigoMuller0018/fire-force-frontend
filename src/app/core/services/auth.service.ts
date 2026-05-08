import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { User } from '../models/user.model';

// chave usada no localStorage pra persistir o token entre reloads
const TOKEN_STORAGE_KEY = 'fire_force_token';

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

  // signal que guarda o token JWT (null = deslogado) — inicial vem do localStorage
  private readonly tokenSignal = signal<string | null>(this.readTokenFromStorage());

  // signal que guarda o usuário atual — restaurado do token se houver (sobrevive a reload)
  private readonly userSignal = signal<User | null>(this.userFromToken(this.tokenSignal()));

  // expõe o token como read-only pra fora do serviço
  readonly token = this.tokenSignal.asReadonly();

  // expõe o usuário como read-only
  readonly user = this.userSignal.asReadonly();

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
  async login(email: string, password: string): Promise<boolean> {
    if (!email || !password) {
      return false;
    }

    try {
      // backend retorna texto puro: token JWT em sucesso, mensagem de erro caso contrário
      const response = await firstValueFrom(
        this.http.post('/api/auth/login', { email, password }, { responseType: 'text' }),
      );

      // heurística: JWT sempre começa com "eyJ" (base64 de '{"'). Se não, é erro.
      if (!response || !response.startsWith('eyJ')) {
        return false;
      }

      // sucesso — guarda o token e restaura o user a partir dele
      this.tokenSignal.set(response);
      this.persistToken(response);
      this.userSignal.set(this.userFromToken(response));

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
    this.router.navigate(['/auth/login']);
  }

  // monta o User a partir do payload do JWT (sub, email, name)
  // se token nulo ou inválido, retorna null
  private userFromToken(token: string | null): User | null {
    if (!token) return null;
    const payload = this.decodeJwtPayload(token);
    if (!payload) return null;

    const email = (payload['email'] as string) ?? '';
    return {
      id: (payload['sub'] as string) ?? crypto.randomUUID(),
      email,
      // backend ainda não inclui "name" no JWT — fallback usa parte antes do @
      name: (payload['name'] as string) ?? email.split('@')[0] ?? 'Usuário',
    };
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

  // persiste token no localStorage
  private persistToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  }
}
