// tipos de carteira — bate com WalletTypeEnum do backend (codigos inteiros)
export enum WalletType {
  CHECKING = 0,    // Conta corrente / banco
  CASH = 1,        // Dinheiro / carteira física
  CREDIT_CARD = 2, // Cartão de crédito
  INVESTMENT = 3,  // Investimento / patrimônio
}

// label exibido no card (segue o mockup)
export const WALLET_TYPE_LABEL: Record<WalletType, string> = {
  [WalletType.CHECKING]: 'Banco digital',
  [WalletType.CASH]: 'Dinheiro',
  [WalletType.CREDIT_CARD]: 'Cartão de crédito',
  [WalletType.INVESTMENT]: 'Investimento',
};

// modelo de Carteira — espelha a entidade Wallet do wallet-service
export interface Wallet {
  uuid: string;
  name: string;
  currentBalance: number;
  description?: string;
  userUuid?: string;

  // tipo da carteira (CHECKING / CASH / CREDIT_CARD / INVESTMENT)
  type: WalletType;

  // cor do card em hex (ex: '#7b2ff7'). Backend usa default '#10b981' se vier vazio.
  color?: string;

  // chave do ícone (ex: 'nubank', 'inter', 'bank'). Frontend mapeia pra imagem/glyph.
  icon?: string;

  // só pra type=CREDIT_CARD
  creditLimit?: number;
  closingDay?: number; // dia 1-31
  dueDay?: number;     // dia 1-31

  currency?: string;   // 'BRL' por padrão
  statusCode?: number; // 0=ACTIVE, 1=INACTIVE, 2=DELETED
}
