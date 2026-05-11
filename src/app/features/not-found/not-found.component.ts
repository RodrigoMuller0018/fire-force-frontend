import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

// página 404 — qualquer rota desconhecida cai aqui (configurado em app.routes.ts com path: '**')
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule, ButtonModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css',
})
export class NotFoundComponent {}
