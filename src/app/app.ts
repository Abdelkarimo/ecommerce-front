import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { Navbar } from './shared/components/navbar/navbar';
import { Footer } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
