import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../shared/components/navbar/navbar';
import { Footer } from '../../shared/components/footer/footer';
import { provideHttpClient } from '@angular/common/http';

/**
 * 🏠 MainLayout Component
 * ------------------------------------------------------------
 * This layout serves as the primary structure for the main
 * sections of the website (Landing, Products, About, etc.).
 * 
 * It provides a consistent layout across public and protected
 * pages, including:
 *  - Navbar (top navigation)
 *  - RouterOutlet (main content area)
 *  - Footer (bottom section)
 */
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Navbar, Footer], // ✅ Standalone component imports
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  // Currently no additional logic required.
  // Acts as a layout container for all main site pages.
}
