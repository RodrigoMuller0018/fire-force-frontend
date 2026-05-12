// formato padrão de resposta do backend (Result/ApiError do Java)
// status: HTTP code (200, 400, etc); message: descrição; message: payload
export interface ApiResponse<T> {
  code: string;
  message: T;
  status: string;
}