import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Wallet } from '../models/wallet.model';
import { ApiResponse } from '../models/api-response.interface';

// chama os endpoints de Wallet do wallet-service
// - GET    /api/wallet       → lista carteiras do usuário logado
// - POST   /api/wallet       → cria nova carteira
@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/wallet';

  // lista carteiras; o backend identifica o usuário pelo JWT (interceptor envia)
  list(): Observable<ApiResponse<Wallet[]>> {
    return this.http.get<ApiResponse<Wallet[]>>(this.base);
  }

  // cria carteira nova
  create(wallet: Wallet): Observable<ApiResponse<Wallet>> {
    return this.http.post<ApiResponse<Wallet>>(this.base, wallet);
  }
}
