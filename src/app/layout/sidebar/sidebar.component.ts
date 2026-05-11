import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

// item do menu lateral
interface NavItem {
  label: string;
  icon: string;
  route: string;
}

// Sidebar: navegação lateral com os links principais da app
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  // lista dos links (manter aqui facilita adicionar novas features depois)
  protected readonly items: NavItem[] = [
    { label: 'Dashboard', icon: 'pi pi-home', route: '/' },
    { label: 'Perfil', icon: 'pi pi-user', route: '/perfil' },
    // futuras: contas, categorias, transações
    // { label: 'Contas', icon: 'pi pi-wallet', route: '/contas' },
    // { label: 'Categorias', icon: 'pi pi-tags', route: '/categorias' },
  ];
}
