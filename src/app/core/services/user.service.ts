import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { ApiResponse } from '../models/api-response.interface';

// chama os endpoints de User
// - GET    /api/user          → info do usuário logado (name/email do token + info extra do User salvo no login)
@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/user';

  private user?: User;

  set(user: User): void {
    this.user = user;
  }
  clear(): void {
    this.user = undefined;
  }

  // get info of user
  get(): Observable<User> {
    return this.http.get<ApiResponse<User>>(this.base).pipe(map((response) => response.message));;
  }
}
