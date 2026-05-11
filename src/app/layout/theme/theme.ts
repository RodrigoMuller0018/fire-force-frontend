import { Component, effect, HostBinding, OnInit, signal } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { MenuModule } from "primeng/menu";

@Component({
  selector: 'app-theme',
  templateUrl: './theme.html',
  imports: [RouterModule, ButtonModule, MenuModule],
  styleUrl: '../topbar/topbar.component.css',
})
export class ThemeComponent {

  darkMode = signal(false);

  constructor() {

    const savedTheme = JSON.parse(
      localStorage.getItem('darkMode') ?? 'false'
    );

    this.darkMode.set(savedTheme);

    effect(() => {
      const enabled = this.darkMode();
      document.documentElement.classList.toggle('dark',enabled);

      localStorage.setItem('darkMode',JSON.stringify(enabled));
    });
  }
  
  toggleTheme(): void {
    this.darkMode.update(v => !v);
  }
}