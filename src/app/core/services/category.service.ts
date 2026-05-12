import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, CategoryType } from '../models/category.model';
import { ApiResponse } from '../models/api-response.interface';

// chama os endpoints de Category do account-service
// - GET    /api/category?type=N  → lista categorias do usuário (filtrado por tipo)
// - POST   /api/category         → cria nova categoria
@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api/category';

  // lista categorias; type opcional filtra por receita/despesa
  list(type?: CategoryType): Observable<ApiResponse<Category[]>> {
    // HttpParams é imutável — sempre reatribuir pra adicionar
    let params = new HttpParams();
    if (type !== undefined) {
      params = params.set('type', String(type));
    }
    return this.http.get<ApiResponse<Category[]>>(this.base, { params });
  }

  // cria categoria nova
  create(category: Category): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(this.base, category);
  }
}
