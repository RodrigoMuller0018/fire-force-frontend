import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { TopbarComponent } from '../topbar/topbar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

// Shell: layout das páginas autenticadas (topbar + sidebar + área de conteúdo)
// Componente "container" — não tem lógica de negócio, só estrutura visual
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, TopbarComponent, SidebarComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css',
})
export class ShellComponent {
  // estado da sidebar (aberta/fechada)
  // inicia aberta em desktop (>=768px) e fechada em mobile (<768px)
  // SSR safety: typeof window check (sem window no servidor)
  readonly sidebarOpen = signal<boolean>(
    typeof window !== 'undefined' && window.innerWidth >= 768,
  );

  // chamado pelo botão de menu no topbar
  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  // chamado pelo backdrop em mobile (clicar fora da sidebar fecha)
  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
