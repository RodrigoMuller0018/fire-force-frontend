import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';

import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../core/services/auth.service';

// página de login (visual do Sakai + lógica que chama o backend)
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
    ReactiveFormsModule,
    RouterModule,
    RippleModule,
    AppFloatingConfigurator,
  ],
  template: `
    <app-floating-configurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-screen overflow-hidden">
      <div class="flex flex-col items-center justify-center">
        <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
          <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
            <div class="text-center mb-8">
              <!-- ícone do FIRE-FORCE -->
              <i class="pi pi-bolt mb-6" style="font-size: 3.5rem; color: var(--primary-color);"></i>
              <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Bem-vindo ao FIRE-FORCE!</div>
              <span class="text-muted-color font-medium">Entre na sua conta</span>
            </div>

            <!-- formulário reativo -->
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <label for="email" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
              <input pInputText id="email" type="email" placeholder="seu@email.com" class="w-full md:w-120 mb-1" formControlName="email" autocomplete="email" />
              @if (form.controls.email.touched && form.controls.email.invalid) {
                <small class="text-red-500 block mb-4">
                  @if (form.controls.email.hasError('required')) {
                    Email é obrigatório
                  } @else if (form.controls.email.hasError('email')) {
                    Email inválido
                  }
                </small>
              } @else {
                <div class="mb-7"></div>
              }

              <label for="password" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Senha</label>
              <p-password
                inputId="password"
                formControlName="password"
                placeholder="••••••••"
                [toggleMask]="true"
                styleClass="mb-1"
                [fluid]="true"
                [feedback]="false"
              />
              @if (form.controls.password.touched && form.controls.password.invalid) {
                <small class="text-red-500 block mb-4">
                  @if (form.controls.password.hasError('required')) {
                    Senha é obrigatória
                  } @else if (form.controls.password.hasError('minlength')) {
                    Mínimo de 6 caracteres
                  }
                </small>
              } @else {
                <div class="mb-7"></div>
              }

              <!-- erro do servidor (credenciais inválidas etc) -->
              @if (errorMessage()) {
                <p-message severity="error" [text]="errorMessage()!" styleClass="w-full mb-4" />
              }

              <p-button
                type="submit"
                label="Entrar"
                icon="pi pi-sign-in"
                styleClass="w-full"
                [loading]="isSubmitting()"
                [disabled]="isSubmitting()"
              />

              <!-- link pra cadastro -->
              <div class="text-center mt-6">
                <span class="text-muted-color">Não tem conta? </span>
                <a routerLink="/auth/register" class="font-medium no-underline ml-2 text-primary cursor-pointer">Cadastre-se</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class Login {
  // injeta dependências (Angular moderno usa inject() em vez de constructor)
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  // signal pra mensagem de erro de auth (null quando não tem erro)
  readonly errorMessage = signal<string | null>(null);

  // signal pra controlar loading do botão
  readonly isSubmitting = signal(false);

  // formulário reativo de login
  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]], // email obrigatório e válido
    password: ['', [Validators.required, Validators.minLength(6)]], // senha mínima 6 chars
  });

  // dispara ao submeter o formulário
  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    const { email, password } = this.form.getRawValue();

    try {
      const success = await this.auth.login(email, password);
      if (!success) {
        this.errorMessage.set('Email ou senha inválidos');
      }
      // se ok, AuthService já redirecionou pra /
    } catch {
      this.errorMessage.set('Erro ao tentar entrar. Tente novamente.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
