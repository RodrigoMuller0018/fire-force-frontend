import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '@/app/core/services/auth.service';

// item de stat exibido no grid (placeholder até conectar com account-service)
interface Stat {
  label: string;
  value: string;
  icon: string;
  iconBg: string; // classe de fundo do ícone
  iconColor: string; // classe de cor do ícone
}

// dashboard do FIRE-FORCE — placeholder até o account-service estar ligado
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- cabeçalho da página -->
    <div class="mb-6">
      <h1 class="text-surface-900 dark:text-surface-0 text-2xl font-medium m-0 mb-1">Dashboard</h1>
      @if (auth.user(); as user) {
        <p class="text-muted-color m-0">Bem-vindo, {{ user.name }} 👋</p>
      }
    </div>

    <!-- grid de stats (4 cards) -->
    <div class="grid grid-cols-12 gap-4 mb-6">
      @for (stat of stats; track stat.label) {
        <div class="col-span-12 sm:col-span-6 xl:col-span-3">
          <div class="card !mb-0">
            <div class="flex items-center gap-4">
              <div class="flex items-center justify-center rounded-border shrink-0" style="width: 3rem; height: 3rem;" [class]="stat.iconBg">
                <i [class]="stat.icon" class="text-xl" [ngClass]="stat.iconColor"></i>
              </div>
              <div class="min-w-0">
                <span class="block text-muted-color font-medium text-sm mb-1">{{ stat.label }}</span>
                <div class="text-surface-900 dark:text-surface-0 font-semibold text-xl">{{ stat.value }}</div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>

    <!-- card de instruções/próximos passos -->
    <div class="card">
      <div class="font-semibold text-xl mb-4">Próximos passos</div>
      <p class="text-surface-700 dark:text-surface-200 leading-relaxed mb-3">
        O dashboard está pronto pra receber conteúdo real. Quando o
        <strong class="text-primary">account-service</strong> estiver ligado, os cards
        acima vão mostrar saldo, receitas/despesas e contagem de transações.
      </p>
      <p class="text-muted-color text-sm m-0">
        Logado como <strong>{{ auth.user()?.email }}</strong>
      </p>
    </div>
  `,
})
export class Dashboard {
  protected readonly auth = inject(AuthService);

  // stats placeholder — substituídos por dados reais quando account-service estiver ligado
  protected readonly stats: Stat[] = [
    {
      label: 'Saldo total',
      value: 'R$ 0,00',
      icon: 'pi pi-wallet',
      iconBg: 'bg-blue-100 dark:bg-blue-400/10',
      iconColor: 'text-blue-500',
    },
    {
      label: 'Receitas (mês)',
      value: 'R$ 0,00',
      icon: 'pi pi-arrow-up',
      iconBg: 'bg-green-100 dark:bg-green-400/10',
      iconColor: 'text-green-500',
    },
    {
      label: 'Despesas (mês)',
      value: 'R$ 0,00',
      icon: 'pi pi-arrow-down',
      iconBg: 'bg-red-100 dark:bg-red-400/10',
      iconColor: 'text-red-500',
    },
    {
      label: 'Transações',
      value: '0',
      icon: 'pi pi-list',
      iconBg: 'bg-purple-100 dark:bg-purple-400/10',
      iconColor: 'text-purple-500',
    },
  ];
}
