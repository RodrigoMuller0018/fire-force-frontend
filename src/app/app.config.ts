import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
import { providePrimeNG } from 'primeng/config';

import { authInterceptor } from './core/interceptors/auth.interceptor';
import { appRoutes } from './app.routes';

// configuração global (providers que valem em toda a app)
export const appConfig: ApplicationConfig = {
  providers: [
    // ativa o router e mantém scroll bonitinho ao trocar de rota
    provideRouter(
      appRoutes,
      withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }),
    ),

    // HttpClient + interceptor que adiciona "Authorization: Bearer <token>" automaticamente
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),

    // Angular zoneless: sem zone.js, usa signals/events. Mais performático e moderno.
    provideZonelessChangeDetection(),

    // tema Aura do PrimeNG (visual padrão). darkModeSelector permite alternar via classe no <html>
    providePrimeNG({
      theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } },
    }),

    // MessageService global → permite chamar MessageService.add() em qualquer componente
    MessageService,
  ],
};
