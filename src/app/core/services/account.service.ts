import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Account } from '../models/account.model';
import { ApiResponse } from '../models/api-response.interface';

// chama os endpoints de Account do account-service
// - GET    /api/account       → lista contas do usuário logado
// - POST   /api/account       → cria nova conta
@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/account';

  // lista contas; o backend identifica o usuário pelo JWT (interceptor envia)
  list(): Observable<ApiResponse<Account[]>> {
    return this.http.get<ApiResponse<Account[]>>(this.base);
  }

  // cria conta nova
  create(account: Account): Observable<ApiResponse<Account>> {
    return this.http.post<ApiResponse<Account>>(this.base, account);
  }
}
