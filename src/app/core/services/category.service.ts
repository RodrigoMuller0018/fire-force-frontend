import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResult } from '../models/api-result.model';
import { Category, CategoryType } from '../models/category.model';

// chama os endpoints de Category do account-service
// - GET    /api/category?type=N  → lista categorias do usuário (filtrado por tipo)
// - POST   /api/category         → cria nova categoria
@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/category';

  // lista categorias; type opcional filtra por receita/despesa
  list(type?: CategoryType): Observable<ApiResult<Category[]>> {
    // HttpParams é imutável — sempre reatribuir pra adicionar
    let params = new HttpParams();
    if (type !== undefined) {
      params = params.set('type', String(type));
    }
    return this.http.get<ApiResult<Category[]>>(this.base, { params });
  }

  // cria categoria nova
  create(category: Category): Observable<ApiResult<Category>> {
    return this.http.post<ApiResult<Category>>(this.base, category);
  }
}
