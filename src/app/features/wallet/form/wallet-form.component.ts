import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

import { Wallet, WALLET_TYPE_LABEL, WalletType } from '../../../core/models/wallet.model';
import { WalletService } from '../../../core/services/wallet.service';
import { WALLET_COLORS, WALLET_ICONS } from '../shared/wallet-visuals';

// opção de tipo exibida no seletor (4 cards: Banco / Dinheiro / Cartão / Investimento)
interface TypeOption {
  type: WalletType;
  label: string;
  description: string;
  icon: string; // classe PrimeIcons mostrada no card de seleção
}

// página de criação OU edição de carteira
//   /carteira/nova           → modo "criar" (POST)
//   /carteira/editar/:uuid   → modo "editar" (GET + PUT)
@Component({
  selector: 'app-wallet-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  standalone: true,
  templateUrl: './wallet-form.component.html',
  styleUrls: ['./wallet-form.component.css'],
})
export class WalletFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly walletService = inject(WalletService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // expõe constantes pro template
  protected readonly WalletType = WalletType;
  protected readonly colors = WALLET_COLORS;
  protected readonly icons = WALLET_ICONS;

  // 4 tipos no seletor (cards no topo do form)
  protected readonly typeOptions: TypeOption[] = [
    { type: WalletType.CHECKING, label: 'Banco', description: 'Contas em bancos digitais ou tradicionais', icon: 'pi pi-building' },
    { type: WalletType.CASH, label: 'Dinheiro', description: 'Dinheiro em espécie ou carteira física', icon: 'pi pi-money-bill' },
    { type: WalletType.CREDIT_CARD, label: 'Cartão de crédito', description: 'Cartões de crédito de qualquer banco', icon: 'pi pi-credit-card' },
    { type: WalletType.INVESTMENT, label: 'Investimento', description: 'Investimentos em geral', icon: 'pi pi-chart-line' },
  ];

  // detecção de modo (criar vs editar) via param :uuid da rota
  readonly editingUuid = signal<string | null>(null);
  readonly isEditMode = computed(() => this.editingUuid() !== null);
  readonly pageTitle = computed(() => (this.isEditMode() ? 'Editar carteira' : 'Nova carteira'));
  readonly submitLabel = computed(() => (this.isEditMode() ? 'Salvar alterações' : 'Salvar carteira'));

  // estado de loading/erro
  readonly loadingInitial = signal(false); // ao buscar dados pro modo edição
  readonly submitting = signal(false);
  readonly errorMsg = signal<string | null>(null);

  // contador de caracteres da descrição (visível no rótulo)
  readonly descriptionMax = 120;

  // form reativo
  // observa: o validator de credit_limit/closing_day/due_day depende do tipo;
  // por simplicidade, validação cruzada fica no submit (não como custom validator do form)
  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    type: [WalletType.CHECKING as WalletType, [Validators.required]],
    currentBalance: [0],
    description: ['', [Validators.maxLength(this.descriptionMax)]],
    color: [this.colors[0].value],
    icon: [this.icons[0].key as string | null],
    creditLimit: [null as number | null],
    closingDay: [null as number | null],
    dueDay: [null as number | null],
  });

  // computed pro preview: reflete o valor atual do form
  readonly previewName = signal('');
  readonly previewType = signal<WalletType>(WalletType.CHECKING);
  readonly previewBalance = signal(0);
  readonly previewColor = signal(this.colors[0].value);
  readonly previewIcon = signal<string | null>(this.icons[0].key);
  readonly previewDescription = signal('');
  readonly previewCreditLimit = signal<number | null>(null);

  readonly previewTypeLabel = computed(() => WALLET_TYPE_LABEL[this.previewType()]);

  // descrição atual (pra contador) — sai vivo do signal
  readonly descriptionCounter = computed(() => `${this.previewDescription().length}/${this.descriptionMax}`);

  // mostra os campos de cartão de crédito só quando tipo = CREDIT_CARD
  readonly isCreditCard = computed(() => this.previewType() === WalletType.CREDIT_CARD);

  constructor() {
    // sincroniza form ↔ signals do preview
    this.form.controls.name.valueChanges.subscribe((v) => this.previewName.set(v ?? ''));
    this.form.controls.type.valueChanges.subscribe((v) => this.previewType.set(v ?? WalletType.CHECKING));
    this.form.controls.currentBalance.valueChanges.subscribe((v) => this.previewBalance.set(v ?? 0));
    this.form.controls.color.valueChanges.subscribe((v) => this.previewColor.set(v ?? this.colors[0].value));
    this.form.controls.icon.valueChanges.subscribe((v) => this.previewIcon.set(v));
    this.form.controls.description.valueChanges.subscribe((v) => this.previewDescription.set(v ?? ''));
    this.form.controls.creditLimit.valueChanges.subscribe((v) => this.previewCreditLimit.set(v));

    // detecta modo edição
    const uuidParam = this.route.snapshot.paramMap.get('uuid');
    if (uuidParam) {
      this.editingUuid.set(uuidParam);
      this.loadWallet(uuidParam);
    }
  }

  // carrega dados da wallet (modo edição)
  private loadWallet(uuid: string): void {
    this.loadingInitial.set(true);
    this.walletService.getById(uuid).subscribe({
      next: (wallet) => {
        // popula o form com os dados que vieram (patchValue ignora campos não declarados)
        this.form.patchValue({
          name: wallet?.name ?? '',
          type: wallet?.type ?? WalletType.CHECKING,
          currentBalance: wallet?.currentBalance ?? 0,
          description: wallet?.description ?? '',
          color: wallet?.color ?? this.colors[0].value,
          icon: wallet?.icon ?? null,
          creditLimit: wallet?.creditLimit ?? null,
          closingDay: wallet?.closingDay ?? null,
          dueDay: wallet?.dueDay ?? null,
        });
        this.loadingInitial.set(false);
      },
      error: (err) => {
        this.errorMsg.set(this.translateError(err, 'Não foi possível carregar a carteira'));
        this.loadingInitial.set(false);
      },
    });
  }

  // seletor de tipo (4 cards) — alterado por click
  selectType(type: WalletType): void {
    this.form.controls.type.setValue(type);
  }

  // seletor de cor (círculo colorido) — click define cor selecionada
  selectColor(color: string): void {
    this.form.controls.color.setValue(color);
  }

  // seletor de ícone — click define ícone (ou limpa se já estava selecionado)
  selectIcon(iconKey: string): void {
    const current = this.form.controls.icon.value;
    this.form.controls.icon.setValue(current === iconKey ? null : iconKey);
  }

  // submete o form (chama POST ou PUT conforme o modo)
  onSubmit(): void {
    // validação cruzada: se cartão de crédito, exige limite/closing/due
    if (this.previewType() === WalletType.CREDIT_CARD) {
      const cl = this.form.controls.creditLimit.value;
      const closing = this.form.controls.closingDay.value;
      const due = this.form.controls.dueDay.value;
      if (cl == null || cl <= 0) {
        this.errorMsg.set('Limite do cartão é obrigatório.');
        return;
      }
      if (closing == null || closing < 1 || closing > 31) {
        this.errorMsg.set('Dia de fechamento inválido (1-31).');
        return;
      }
      if (due == null || due < 1 || due > 31) {
        this.errorMsg.set('Dia de vencimento inválido (1-31).');
        return;
      }
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMsg.set(null);

    const v = this.form.getRawValue();
    const payload: Wallet = {
      uuid: this.editingUuid() ?? '',
      name: v.name.trim(),
      type: v.type,
      currentBalance: v.currentBalance ?? 0,
      description: v.description?.trim() || undefined,
      color: v.color,
      icon: v.icon ?? undefined,
      creditLimit: v.creditLimit ?? undefined,
      closingDay: v.closingDay ?? undefined,
      dueDay: v.dueDay ?? undefined,
    };

    const editing = this.editingUuid();
    const request$ = editing
      ? this.walletService.update(editing, payload)
      : this.walletService.create(payload);

    request$.subscribe({
      next: () => {
        this.submitting.set(false);
        this.router.navigate(['/carteira']);
      },
      error: (err) => {
        const fallback = this.isEditMode()
          ? 'Não foi possível salvar as alterações'
          : 'Não foi possível criar a carteira';
        this.errorMsg.set(this.translateError(err, fallback));
        this.submitting.set(false);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/carteira']);
  }

  // formata número como moeda BR (R$ X.XXX,XX)
  formatCurrency(value: number | null | undefined): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value ?? 0);
  }

  // iniciais pro avatar do preview ("Nubank" → "N", "Carteira Física" → "C")
  previewInitial(): string {
    const name = this.previewName().trim();
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  // traduz erros HTTP em mensagem humana
  private translateError(err: unknown, fallback: string): string {
    const httpErr = err as { status?: number; error?: { message?: unknown } };
    if (httpErr?.status === 401 || httpErr?.status === 403)
      return 'Sua sessão expirou. Faça login novamente.';
    if (httpErr?.status === 404) return 'Carteira não encontrada.';
    if (httpErr?.status === 0) return 'Sem conexão com o servidor.';
    if (typeof httpErr?.status === 'number' && httpErr.status >= 500)
      return 'Erro no servidor. Tente novamente em instantes.';
    const msg = httpErr?.error?.message;
    if (typeof msg === 'string' && msg.trim().length > 0) return msg;
    return fallback;
  }
}
