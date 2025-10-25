import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../shared/components/navbar/navbar';

/**
 * 🔐 AuthLayout Component
 * ---------------------------------------------
 * This layout is used for authentication-related pages
 * such as Login and Register.
 * 
 * It provides a consistent structure for all auth routes.
 * Typically includes a simple layout (e.g., logo or navbar)
 * and the router outlet to display the current auth page.
 */
@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, Navbar], // ✅ Standalone component imports
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout {
  // Currently no additional logic required.
  // This layout acts as a container for auth-related pages.
}
