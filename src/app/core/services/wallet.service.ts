import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Wallet } from '../models/wallet.model';
import { ApiResponse } from '../models/api-response.interface';

// chama os endpoints de Wallet do wallet-service (porta 8002, via proxy /api)
//   GET    /api/wallet           → lista carteiras do user (já filtra status DELETED)
//   GET    /api/wallet/{uuid}    → busca uma (pra tela de edição)
//   POST   /api/wallet           → cria nova
//   PUT    /api/wallet/{uuid}    → atualiza existente
//   DELETE /api/wallet/{uuid}    → soft delete (status_code = DELETED)
// Backend retorna ApiResponse { code, message: <payload>, status } — extraímos message direto.
@Injectable({ providedIn: 'root' })
export class WalletService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/wallet';

  // lista carteiras (o user_uuid vem do JWT pelo interceptor)
  list(): Observable<Wallet[]> {
    return this.http
      .get<ApiResponse<Wallet[]>>(this.base)
      .pipe(map((response) => response.message ?? []));
  }

  // busca uma carteira específica (usado pra preencher form de edição)
  getById(uuid: string): Observable<Wallet> {
    return this.http
      .get<ApiResponse<Wallet>>(`${this.base}/${uuid}`)
      .pipe(map((response) => response.message));
  }

  // cria carteira nova; backend gera o uuid e retorna o objeto completo
  create(wallet: Wallet): Observable<Wallet> {
    return this.http
      .post<ApiResponse<Wallet>>(this.base, wallet)
      .pipe(map((response) => response.message));
  }

  // atualiza carteira existente (uuid vai na URL, não no body)
  update(uuid: string, wallet: Wallet): Observable<Wallet> {
    return this.http
      .put<ApiResponse<Wallet>>(`${this.base}/${uuid}`, wallet)
      .pipe(map((response) => response.message));
  }

  // soft delete — backend só marca status_code, mantém histórico no banco
  delete(uuid: string): Observable<string> {
    return this.http
      .delete<ApiResponse<string>>(`${this.base}/${uuid}`)
      .pipe(map((response) => response.message));
  }
}
