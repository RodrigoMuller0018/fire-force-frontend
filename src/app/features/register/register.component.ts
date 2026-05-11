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

import { AuthService } from '../../core/services/auth.service';

// validador customizado: confere se password === confirmPassword no nível do grupo
const passwordsMatchValidator: ValidatorFn = (group: AbstractControl) => {
  const pw = group.get('password')?.value;
  const cpw = group.get('confirmPassword')?.value;
  // retorna null = válido; objeto com erro = inválido
  return pw === cpw ? null : { passwordsMismatch: true };
};

// página de cadastro — cria usuário no backend e já loga em sequência
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
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);

  readonly errorMessage = signal<string | null>(null);
  readonly isSubmitting = signal(false);

  // form com 5 campos + validator no nível do grupo (passwordsMatch)
  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      document: ['', [Validators.required, Validators.minLength(11)]], // CPF (11 dígitos)
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
