import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private isDarkTheme: boolean = false;
  constructor(@Inject(DOCUMENT) private document: Document) {
    // Ahora puedes utilizar 'document' de forma segura dentro de este servicio.
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.document.body.classList.toggle('dark', this.isDarkTheme);
  }

  isDark() {
    return this.isDarkTheme;
  }

}
