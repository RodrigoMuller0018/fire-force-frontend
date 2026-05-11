import { Component, effect, HostBinding, inject, output, signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

import { AuthService } from '../../core/services/auth.service';
import { ThemeComponent } from "../theme/theme";

// Topbar: barra superior com botão menu, logo e menu do usuário (perfil/logout)
@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, ButtonModule, MenuModule, ThemeComponent],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
})
export class TopbarComponent {
  // output() é o equivalente moderno ao @Output() — Shell escuta com (toggleMenu)
  readonly toggleMenu = output<void>();

  // expõe auth pro template (mostra nome/email do usuário logado)
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // itens do menu dropdown do avatar (PrimeNG p-menu usa esse formato)
  protected readonly userMenuItems: MenuItem[] = [
    {
      label: 'Meu perfil',
      icon: 'pi pi-user',
      command: () => this.router.navigate(['/perfil']),
    },
    { separator: true },
    {
      label: 'Sair',
      icon: 'pi pi-sign-out',
      command: () => this.auth.logout(),
    },
  ];

  // emite pro Shell que o usuário clicou no botão menu
  onToggleClick(): void {
    this.toggleMenu.emit();
  }
}
