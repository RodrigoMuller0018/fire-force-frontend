import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';

import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { AuthService } from '../../core/services/auth.service';

// validador que confere se password e confirmPassword batem
const passwordsMatchValidator: ValidatorFn = (group: AbstractControl) => {
  const pw = group.get('password')?.value;
  const cpw = group.get('confirmPassword')?.value;
  return pw === cpw ? null : { passwordsMismatch: true };
};

// página de cadastro (mesmo visual do login)
@Component({
  selector: 'app-register',
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
      <div class="flex flex-col items-center justify-center py-8">
        <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
          <div class="w-full bg-surface-0 dark:bg-surface-900 py-12 px-8 sm:px-20" style="border-radius: 53px">
            <div class="text-center mb-6">
              <i class="pi pi-user-plus mb-4" style="font-size: 3rem; color: var(--primary-color);"></i>
              <div class="text-surface-900 dark:text-surface-0 text-2xl font-medium mb-2">Criar conta</div>
              <span class="text-muted-color font-medium">Cadastre-se no FIRE-FORCE</span>
            </div>

            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <!-- nome -->
              <label for="name" class="block text-surface-900 dark:text-surface-0 text-lg font-medium mb-1">Nome</label>
              <input pInputText id="name" type="text" placeholder="Seu nome completo" class="w-full md:w-120 mb-1" formControlName="name" autocomplete="name" />
              @if (form.controls.name.touched && form.controls.name.invalid) {
                <small class="text-red-500 block mb-3">
                  @if (form.controls.name.hasError('required')) { Nome é obrigatório }
                  @else if (form.controls.name.hasError('minlength')) { Mínimo 2 caracteres }
                </small>
              } @else {
                <div class="mb-4"></div>
              }

              <!-- email -->
              <label for="email" class="block text-surface-900 dark:text-surface-0 text-lg font-medium mb-1">Email</label>
              <input pInputText id="email" type="email" placeholder="seu@email.com" class="w-full mb-1" formControlName="email" autocomplete="email" />
              @if (form.controls.email.touched && form.controls.email.invalid) {
                <small class="text-red-500 block mb-3">
                  @if (form.controls.email.hasError('required')) { Email é obrigatório }
                  @else if (form.controls.email.hasError('email')) { Email inválido }
                </small>
              } @else {
                <div class="mb-4"></div>
              }

              <!-- CPF -->
              <label for="document" class="block text-surface-900 dark:text-surface-0 text-lg font-medium mb-1">CPF</label>
              <input pInputText id="document" type="text" placeholder="000.000.000-00" inputmode="numeric" class="w-full mb-1" formControlName="document" />
              @if (form.controls.document.touched && form.controls.document.invalid) {
                <small class="text-red-500 block mb-3">
                  @if (form.controls.document.hasError('required')) { CPF é obrigatório }
                  @else if (form.controls.document.hasError('minlength')) { Mínimo 11 dígitos }
                </small>
              } @else {
                <div class="mb-4"></div>
              }

              <!-- senha (com força) -->
              <label for="password" class="block text-surface-900 dark:text-surface-0 text-lg font-medium mb-1">Senha</label>
              <p-password inputId="password" formControlName="password" placeholder="••••••••" [toggleMask]="true" [fluid]="true" [feedback]="true" styleClass="mb-1" />
              @if (form.controls.password.touched && form.controls.password.invalid) {
                <small class="text-red-500 block mb-3">
                  @if (form.controls.password.hasError('required')) { Senha é obrigatória }
                  @else if (form.controls.password.hasError('minlength')) { Mínimo 6 caracteres }
                </small>
              } @else {
                <div class="mb-4"></div>
              }

              <!-- confirma senha -->
              <label for="confirmPassword" class="block text-surface-900 dark:text-surface-0 text-lg font-medium mb-1">Confirmar senha</label>
              <p-password inputId="confirmPassword" formControlName="confirmPassword" placeholder="••••••••" [toggleMask]="true" [fluid]="true" [feedback]="false" styleClass="mb-1" />
              @if (form.controls.confirmPassword.touched && form.controls.confirmPassword.hasError('required')) {
                <small class="text-red-500 block mb-3">Confirmação obrigatória</small>
              } @else if (form.controls.confirmPassword.touched && form.hasError('passwordsMismatch')) {
                <small class="text-red-500 block mb-3">Senhas não coincidem</small>
              } @else {
                <div class="mb-4"></div>
              }

              @if (errorMessage()) {
                <p-message severity="error" [text]="errorMessage()!" styleClass="w-full mb-4" />
              }

              <p-button
                type="submit"
                label="Cadastrar"
                icon="pi pi-user-plus"
                styleClass="w-full"
                [loading]="isSubmitting()"
                [disabled]="isSubmitting()"
              />

              <!-- link de volta pro login -->
              <div class="text-center mt-6">
                <span class="text-muted-color">Já tem conta? </span>
                <a routerLink="/auth/login" class="font-medium no-underline ml-2 text-primary cursor-pointer">Entrar</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  readonly errorMessage = signal<string | null>(null);
  readonly isSubmitting = signal(false);

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      document: ['', [Validators.required, Validators.minLength(11)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatchValidator },
  );

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    this.isSubmitting.set(true);

    const { name, email, document, password } = this.form.getRawValue();

    const result = await this.auth.signup({ name, email, document, password });
    if (!result.ok) {
      this.errorMessage.set(result.error ?? 'Erro ao cadastrar');
    }

    this.isSubmitting.set(false);
  }
}
