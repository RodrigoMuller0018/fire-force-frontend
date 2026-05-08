import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

import { AuthService } from '@/app/core/services/auth.service';

// página de perfil (somente leitura — dados extraídos do JWT)
// quando backend tiver GET /auth/me, basta substituir as fontes de dados
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ButtonModule, MessageModule],
  template: `
    <!-- cabeçalho da página -->
    <div class="mb-6">
      <h1 class="text-surface-900 dark:text-surface-0 text-2xl font-medium m-0 mb-1">Perfil</h1>
      <p class="text-muted-color m-0">Suas informações de acesso</p>
    </div>

    <!-- aviso: edição desabilitada por enquanto -->
    <p-message severity="info" styleClass="w-full mb-4">
      <ng-template pTemplate="content">
        <i class="pi pi-info-circle mr-2"></i>
        Edição de perfil será habilitada quando o backend expor o endpoint
        <code class="px-1">GET/PUT /auth/me</code>.
      </ng-template>
    </p-message>

    @if (auth.user(); as user) {
      <!-- card com identidade do usuário -->
      <div class="card mb-4">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <!-- avatar com iniciais -->
          <div
            class="flex items-center justify-center rounded-full font-semibold text-white shrink-0"
            style="width: 5rem; height: 5rem; font-size: 2rem; background: var(--primary-color);"
          >
            {{ initials() }}
          </div>

          <!-- info principal -->
          <div class="flex-1 text-center sm:text-left">
            <div class="text-surface-900 dark:text-surface-0 text-xl font-semibold mb-1">
              {{ user.name }}
            </div>
            <div class="text-muted-color mb-3">{{ user.email }}</div>

            <!-- ID do usuário (cópia rápida) -->
            <div class="text-xs text-muted-color">
              <span class="block mb-1">ID do usuário</span>
              <code class="block break-all bg-surface-100 dark:bg-surface-800 p-2 rounded">{{ user.id }}</code>
            </div>
          </div>
        </div>
      </div>

      <!-- card com info da sessão (extraído do JWT) -->
      <div class="card">
        <h2 class="text-surface-900 dark:text-surface-0 text-lg font-medium m-0 mb-4">Sessão atual</h2>

        @if (auth.tokenInfo(); as info) {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- emitido em -->
            <div>
              <div class="text-muted-color text-sm mb-1">Login feito em</div>
              <div class="text-surface-900 dark:text-surface-0 font-medium">
                {{ info.issuedAt | date: 'dd/MM/yyyy HH:mm:ss' }}
              </div>
            </div>

            <!-- expira em -->
            <div>
              <div class="text-muted-color text-sm mb-1">Sessão expira em</div>
              <div class="text-surface-900 dark:text-surface-0 font-medium">
                {{ info.expiresAt | date: 'dd/MM/yyyy HH:mm:ss' }}
                @if (timeRemaining(); as remaining) {
                  <span class="block text-xs text-muted-color font-normal">
                    (em {{ remaining }})
                  </span>
                }
              </div>
            </div>
          </div>
        }

        <!-- botão de logout (extra — também tá no topbar) -->
        <div class="mt-6 flex justify-end">
          <p-button
            label="Sair da conta"
            icon="pi pi-sign-out"
            severity="danger"
            [outlined]="true"
            (onClick)="logout()"
          />
        </div>
      </div>
    } @else {
      <p-message severity="warn" text="Não foi possível carregar dados do usuário." />
    }
  `,
})
export class Profile {
  // expõe o serviço pro template
  protected readonly auth = inject(AuthService);

  // computed: iniciais do nome (ex: "Teste FIRE" → "TF")
  protected readonly initials = computed(() => {
    const name = this.auth.user()?.name ?? '';
    const parts = name.trim().split(/\s+/).slice(0, 2); // até 2 palavras
    return parts.map((p) => p.charAt(0).toUpperCase()).join('') || '?';
  });

  // computed: texto humanizado de "tempo restante" (ex: "3h 27min")
  protected readonly timeRemaining = computed(() => {
    const exp = this.auth.tokenInfo()?.expiresAt;
    if (!exp) return null;

    const diffMs = exp.getTime() - Date.now();
    if (diffMs <= 0) return 'expirada';

    const totalMin = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMin / 60);
    const mins = totalMin % 60;

    // formata: 3h 27min, ou 27min, ou expirada
    if (hours > 0) return `${hours}h ${mins}min`;
    return `${mins}min`;
  });

  // dispara logout
  protected logout(): void {
    this.auth.logout();
  }
}
