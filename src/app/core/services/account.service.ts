import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Account } from '../models/account.model';
import { ApiResult } from '../models/api-result.model';

// chama os endpoints de Account do account-service
// - GET    /api/account       → lista contas do usuário logado
// - POST   /api/account       → cria nova conta
@Injectable({ providedIn: 'root' })
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/account';

  // lista contas; o backend identifica o usuário pelo JWT (interceptor envia)
  list(): Observable<ApiResult<Account[]>> {
    return this.http.get<ApiResult<Account[]>>(this.base);
  }

  // cria conta nova
  create(account: Account): Observable<ApiResult<Account>> {
    return this.http.post<ApiResult<Account>>(this.base, account);
  }
}
