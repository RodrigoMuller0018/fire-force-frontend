// tipo da categoria (mapear quando o backend definir os códigos)
// 1 = receita, 2 = despesa (placeholder — confirmar com o backend)
export type CategoryType = 1 | 2;

// modelo de Categoria — espelha a entidade Category do account-service
export interface Category {
  uuid?: string;
  name: string;
  type: CategoryType;
  userUuid?: string;
  statusCode?: number;
  updatedAt?: string;
  createdAt?: string;
}
