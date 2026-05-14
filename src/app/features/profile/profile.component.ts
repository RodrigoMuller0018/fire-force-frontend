import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

import { AuthService } from '../../core/services/auth.service';

// página de perfil — exibe dados do usuário extraídos do JWT (somente leitura por ora)
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [DatePipe, ButtonModule, MessageModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../../shared/styles/section.css'],
})
export class ProfileComponent {
  // expõe auth pro template (user + tokenInfo)
  protected readonly auth = inject(AuthService);

  // computed: iniciais do nome pra mostrar no avatar (ex: "João Silva" → "JS")
  protected readonly initials = computed(() => {
    const name = this.auth.user()?.name ?? '';
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p.charAt(0).toUpperCase()).join('') || '?';
  });

  // computed: tempo restante até expirar a sessão (ex: "3h 27min", "expirada")
  protected readonly timeRemaining = computed(() => {
    const exp = this.auth.tokenInfo()?.expiresAt;
    if (!exp) return null;

    const diffMs = exp.getTime() - Date.now();
    if (diffMs <= 0) return 'expirada';

    const totalMin = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMin / 60);
    const mins = totalMin % 60;

    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  });

  // dispara logout (limpa token + redireciona pra /auth/login)
  protected logout(): void {
    this.auth.logout();
  }
}
