// constantes visuais usadas pela tela de carteira (lista + form)
// mantenho aqui em um arquivo separado pra reusar e ter ponto único de mudança

// paleta de cores oferecidas no seletor (form). Valor = hex que vai pro banco.
export interface WalletColor {
  value: string; // hex (ex: '#10b981')
  label: string;
}

export const WALLET_COLORS: WalletColor[] = [
  { value: '#10b981', label: 'Verde' },
  { value: '#7b2ff7', label: 'Roxo' },
  { value: '#3b82f6', label: 'Azul' },
  { value: '#f97316', label: 'Laranja' },
  { value: '#ef4444', label: 'Vermelho' },
  { value: '#06b6d4', label: 'Ciano' },
  { value: '#facc15', label: 'Amarelo' },
];

// ícones predefinidos (chave guardada no banco, label/glyph renderizado na UI).
// "glyph" pode ser uma classe do PrimeIcons (pi pi-*) ou texto curto.
// (quando quiser usar SVG/PNG dos bancos, troca por path em public/icons/)
export interface WalletIcon {
  key: string;     // valor que vai pro banco (ex: 'bank', 'nubank')
  label: string;   // nome humano (tooltip)
  glyph: string;   // classe PrimeIcons OU texto (ex: 'pi pi-building', 'nu')
}

export const WALLET_ICONS: WalletIcon[] = [
  { key: 'bank', label: 'Banco', glyph: 'pi pi-building' },
  { key: 'cash', label: 'Dinheiro', glyph: 'pi pi-money-bill' },
  { key: 'credit-card', label: 'Cartão', glyph: 'pi pi-credit-card' },
  { key: 'wallet', label: 'Carteira', glyph: 'pi pi-wallet' },
  { key: 'chart', label: 'Gráfico', glyph: 'pi pi-chart-line' },
  { key: 'piggy', label: 'Cofrinho', glyph: 'pi pi-piggy-bank' },
];

// dado um icon (chave guardada no banco), devolve a classe pra renderizar.
// Se a chave for desconhecida, usa 'pi pi-wallet' como fallback.
export function iconGlyph(icon?: string | null): string {
  if (!icon) return 'pi pi-wallet';
  const found = WALLET_ICONS.find((i) => i.key === icon);
  return found ? found.glyph : 'pi pi-wallet';
}
