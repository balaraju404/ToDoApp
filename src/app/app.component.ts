import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isDarkTheme: boolean = false;

  toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;
      // Save the theme preference to local storage or a backend service
      // You can use this.isDarkTheme to apply theme-specific styles dynamically
  }
}
