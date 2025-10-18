import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Landing } from './features/landing/landing/landing';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Landing, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('ecommerce-front');
}
