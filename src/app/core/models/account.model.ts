// modelo de Conta — espelha a entidade Account do account-service
export interface Account {
  uuid: string;
  name: string;
  currentBalance: number;
  description?: string;
  userUuid?: string;
}
