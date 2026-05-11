import { Component, inject } from '@angular/core';

import { AuthService } from '../../core/services/auth.service';

// estrutura de um card de estatística (placeholder até ligar com o account-service)
interface Stat {
  label: string;
  value: string;
  icon: string;
  color: string; // classe CSS pra colorir o ícone (ver dashboard.component.css)
}

// página inicial após login — visão geral das finanças (saldo, receitas, despesas, etc)
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  // expõe o auth pro template (mostra nome do usuário no cabeçalho)
  protected readonly auth = inject(AuthService);

  // stats placeholder — depois vão vir do account-service via DashboardService
  protected readonly stats: Stat[] = [
    { label: 'Saldo total', value: 'R$ 0,00', icon: 'pi pi-wallet', color: 'stat-blue' },
    { label: 'Receitas (mês)', value: 'R$ 0,00', icon: 'pi pi-arrow-up', color: 'stat-green' },
    { label: 'Despesas (mês)', value: 'R$ 0,00', icon: 'pi pi-arrow-down', color: 'stat-red' },
    { label: 'Transações', value: '0', icon: 'pi pi-list', color: 'stat-purple' },
  ];
}
