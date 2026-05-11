import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';

// componente raiz da app — só hospeda o router-outlet e o Toast global
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
