import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

// menu lateral do FIRE-FORCE (adicionar novas seções aqui conforme criar features)
@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `<ul class="layout-menu">
    @for (item of model; track item.label) {
      @if (!item.separator) {
        <li app-menuitem [item]="item" [root]="true"></li>
      } @else {
        <li class="menu-separator"></li>
      }
    }
  </ul>`,
})
export class AppMenu {
  model: MenuItem[] = [];

  ngOnInit() {
    // estrutura do menu — adicione novas seções aqui (Transações, Relatórios...)
    this.model = [
      {
        label: 'Geral',
        items: [
          { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
        ],
      },
      {
        label: 'Conta',
        items: [
          { label: 'Perfil', icon: 'pi pi-fw pi-user', routerLink: ['/perfil'] },
        ],
      },
      // futuras seções:
      // { label: 'Finanças', items: [
      //   { label: 'Transações', icon: 'pi pi-fw pi-list', routerLink: ['/transacoes'] },
      //   { label: 'Relatórios', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/relatorios'] },
      // ]},
    ];
  }
}
