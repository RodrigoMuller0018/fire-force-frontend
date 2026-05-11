// formato padrão de resposta do backend (Result/ApiError do Java)
// status: HTTP code (200, 400, etc); message: descrição; data: payload
export interface ApiResult<T = unknown> {
  status: number;
  message?: string;
  code?: string;
  data?: T;
}
