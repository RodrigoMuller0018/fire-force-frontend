// modelo do usuário autenticado (vai evoluir conforme o backend retorna mais campos)
export interface User {
  uuid: string;
  name: string;
  email: string;
  statusCode: number;
  updatedAt: string;
  createdAt: string;
}