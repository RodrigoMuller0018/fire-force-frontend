// modelo de Conta — espelha a entidade Wallet do Wallet-service
export interface Wallet {
  uuid: string;
  name: string;
  currentBalance: number;
  description?: string;
  userUuid?: string;
}
