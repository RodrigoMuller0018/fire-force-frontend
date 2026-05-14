import { CommonModule } from '@angular/common';
import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { Wallet, WALLET_TYPE_LABEL, WalletType } from '../../../core/models/wallet.model';
import { WalletService } from '../../../core/services/wallet.service';
import { iconGlyph } from '../shared/wallet-visuals';

// chip de filtro por tipo (Todas / Banco / Dinheiro / Cartão / Investimento)
// uso null pra "Todas"
interface TypeFilter {
  label: string;
  value: WalletType | null;
}

@Component({
  selector: 'app-wallet-list',
  imports: [CommonModule, FormsModule, RouterModule],
  standalone: true,
  templateUrl: './wallet-list.component.html',
  styleUrls: ['./wallet-list.component.css'],
})
export class WalletListComponent {
  private readonly walletService = inject(WalletService);
  private readonly router = inject(Router);

  // expõe pro template (precisa pra @switch no HTML comparar enum)
  protected readonly WalletType = WalletType;
  protected readonly typeLabel = WALLET_TYPE_LABEL;

  // estado da lista
  readonly wallets = signal<Wallet[]>([]);
  readonly loading = signal(true);
  readonly errorMsg = signal<string | null>(null);

  // filtros (busca + chip de tipo)
  readonly searchTerm = signal('');
  readonly activeType = signal<WalletType | null>(null);

  // menu de 3 pontinhos: guarda o uuid da wallet com menu aberto (null = todos fechados)
  readonly openMenuFor = signal<string | null>(null);

  // modal de confirmação de exclusão: guarda a wallet alvo (null = modal fechado)
  readonly confirmingDelete = signal<Wallet | null>(null);
  readonly deleting = signal(false);

  // chips do filtro de tipo (renderizados na UI)
  readonly typeFilters: TypeFilter[] = [
    { label: 'Todas', value: null },
    { label: 'Bancos', value: WalletType.CHECKING },
    { label: 'Dinheiro', value: WalletType.CASH },
    { label: 'Cartões de crédito', value: WalletType.CREDIT_CARD },
    { label: 'Investimentos', value: WalletType.INVESTMENT },
  ];

  // computed: lista filtrada por busca + tipo
  readonly filteredWallets = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const type = this.activeType();

    return this.wallets().filter((w) => {
      if (type !== null && w.type !== type) return false;

      if (term) {
        const matchName = w.name.toLowerCase().includes(term);
        const matchDesc = w.description?.toLowerCase().includes(term) ?? false;
        if (!matchName && !matchDesc) return false;
      }

      return true;
    });
  });

  constructor() {
    this.loadWallets();
  }

  private loadWallets(): void {
    this.loading.set(true);
    this.errorMsg.set(null);

    this.walletService.list().subscribe({
      next: (wallets) => {
        this.wallets.set(wallets);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMsg.set(this.translateError(err));
        this.loading.set(false);
      },
    });
  }

  // ============ NAVEGAÇÃO ============

  goToCreate(): void {
    this.router.navigate(['/carteira/nova']);
  }

  goToEdit(wallet: Wallet): void {
    this.router.navigate(['/carteira/editar', wallet.uuid]);
  }

  // ============ MENU DROPDOWN (3 pontinhos) ============

  // toggle do menu: $event.stopPropagation evita que o click chegue no card e dispare goToEdit
  toggleMenu(wallet: Wallet, event: MouseEvent): void {
    event.stopPropagation();
    // se já estava aberto, fecha; senão abre o desse card (fecha qualquer outro)
    this.openMenuFor.set(this.openMenuFor() === wallet.uuid ? null : wallet.uuid);
  }

  // clique fora do menu fecha qualquer um que estiver aberto
  // (HostListener escuta clicks no documento todo)
  @HostListener('document:click')
  onDocumentClick(): void {
    this.openMenuFor.set(null);
  }

  // editar via menu (precisa parar a propagação)
  editFromMenu(wallet: Wallet, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuFor.set(null);
    this.goToEdit(wallet);
  }

  // ============ DELETE (com confirmação) ============

  // abre o modal de confirmação (não deleta ainda)
  askDelete(wallet: Wallet, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuFor.set(null);
    this.confirmingDelete.set(wallet);
  }

  // cancela o delete (fecha modal)
  cancelDelete(): void {
    this.confirmingDelete.set(null);
  }

  // confirma o delete: chama backend, remove da lista, fecha modal
  confirmDelete(): void {
    const wallet = this.confirmingDelete();
    if (!wallet) return;

    this.deleting.set(true);
    this.walletService.delete(wallet.uuid).subscribe({
      next: () => {
        // remove da lista local (evita refetch)
        this.wallets.update((list) => list.filter((w) => w.uuid !== wallet.uuid));
        this.deleting.set(false);
        this.confirmingDelete.set(null);
      },
      error: (err) => {
        this.errorMsg.set(this.translateError(err));
        this.deleting.set(false);
        this.confirmingDelete.set(null);
      },
    });
  }

  // ============ HELPERS DE EXIBIÇÃO ============

  formatBalance(value: number | undefined): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value ?? 0);
  }

  iconClass(wallet: Wallet): string {
    return iconGlyph(wallet.icon);
  }

  walletColor(wallet: Wallet): string {
    return wallet.color || '#10b981';
  }

  availableCredit(wallet: Wallet): number {
    return (wallet.creditLimit ?? 0) + (wallet.currentBalance ?? 0);
  }

  private translateError(err: unknown): string {
    const httpErr = err as { status?: number };
    if (httpErr?.status === 401 || httpErr?.status === 403)
      return 'Sua sessão expirou. Faça login novamente.';
    if (httpErr?.status === 0)
      return 'Sem conexão com o servidor. Verifique se o backend está rodando.';
    if (typeof httpErr?.status === 'number' && httpErr.status >= 500)
      return 'Erro no servidor. Tente novamente em instantes.';
    return 'Não foi possível carregar as carteiras.';
  }
}
