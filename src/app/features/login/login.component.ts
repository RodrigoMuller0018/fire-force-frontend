import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';

import { AuthService } from '../../core/services/auth.service';
import { ThemeComponent } from "@/app/layout/theme/theme";

// página de login — autentica o usuário e redireciona pro dashboard
@Component({
  selector: 'app-login',
  standalone: true,
  // imports: módulos PrimeNG usados no template + ReactiveForms + RouterLink
  imports: [
    ButtonModule,
    InputTextModule,
    PasswordModule,
    MessageModule,
    ReactiveFormsModule,
    RouterModule,
    ThemeComponent
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  // injeção via inject() — padrão moderno do Angular (mais limpo que constructor)
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  // signals: estado reativo nativo do Angular 16+ (mais simples que RxJS pra UI local)
  // mensagem de erro retornada pelo backend (null quando não há erro)
  readonly errorMessage = signal<string | null>(null);

  // controla loading do botão "Entrar"
  readonly isSubmitting = signal(false);

  // formulário reativo: validação + state gerenciado pelo Angular
  // nonNullable: garante que getRawValue() retorna tipos não-nulos
  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // dispara ao submeter o form
  async onSubmit(): Promise<void> {
    // se inválido, mostra os erros e para por aqui
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
      // em sucesso, AuthService já redirecionou pra "/"
    } catch {
      this.errorMessage.set('Erro ao tentar entrar. Tente novamente.');
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
