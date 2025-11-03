import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../core/auth/auth';
import { Data } from '../../../core/services/data';
import { User } from '../../../core/interface/User';
import { CommonModule } from '@angular/common';

// 🔹 Firebase imports
import {
  getAuth,
  signInWithPopup,
  FacebookAuthProvider,
  GoogleAuthProvider,
} from '@angular/fire/auth';

/**
 * 📝 Register Component
 * ------------------------------------------------------------
 * Handles user registration via:
 *  - Email/password (manual)
 *  - Google OAuth
 *  - Facebook OAuth
 *
 * Responsibilities:
 *  - Validate & register users (via Auth service for manual)
 *  - Handle social sign-in and map Firebase user to local User model
 *  - Persist users to localStorage and update Data/Auth services
 */
@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [FormsModule, RouterLink, CommonModule],
})
export class Register {
  /** ✏️ Form model for manual registration */
  formData = { name: '', email: '', password: '' };

  /** ✅ Success message shown on UI */
  message = '';

  /** ❌ Error message shown on UI */
  errorMessage = '';

  /** ⏳ Loading state for async social actions */
  isLoading = false;

  constructor(
    private auth: Auth,    // Auth service (manual registration/login)
    private data: Data,    // Shared Data service to set current user
    private router: Router // Router for navigation after registration
  ) {}

  // ------------------------------------------------------------
  // 🧾 Manual Registration (Email + Password)
  // ------------------------------------------------------------
  /** 📝 Normal registration */
  onSubmit() {
    this.clearMessages(); // Reset previous messages

    const success = this.auth.register(this.formData); // Attempt register via Auth

    if (success) {
      // Registration succeeded — inform user
      this.message = 'Registration successful! You can now login.';
    } else {
      // Duplicate email detected — show error
      this.errorMessage = 'Email already exists!';
    }
  }

  // ------------------------------------------------------------
  // 🌐 Social Registration (Google / Facebook)
  // ------------------------------------------------------------
  /** 🌐 Register via Google */
  async registerWithGoogle() {
    await this.handleSocialLogin(new GoogleAuthProvider(), 'google');
  }

  /** 📘 Register via Facebook */
  async registerWithFacebook() {
    await this.handleSocialLogin(new FacebookAuthProvider(), 'facebook');
  }

  /**
   * 🧩 Unified handler for Google/Facebook registration
   * - opens provider popup
   * - maps firebase user -> local User model
   * - persists user or shows appropriate errors
   */
  private async handleSocialLogin(provider: any, source: 'google' | 'facebook') {
    this.clearMessages();
    this.isLoading = true;

    const firebaseAuth = getAuth();

    try {
      // Attempt sign-in with popup for the given provider
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;

      // Some providers may not return email — ensure it's present
      if (!user.email) {
        this.errorMessage = 'Could not retrieve your email. Please try again.';
        return;
      }

      // Map Firebase user to our User interface
      const mappedUser: User = {
        id: user.uid,
        name: user.displayName || 'Unknown User',
        email: user.email,
        role: 'user',
        source, // 'google' | 'facebook'
        picture: user.photoURL || '',
        cart: [],
        favourites: [],
      };

      // Save mapped user (or show error if already exists)
      this.saveSocialUser(mappedUser);
    } catch (error) {
      console.error(`${source} registration error:`, error);
      // Friendly message (capitalize provider name)
      this.errorMessage = `${source.charAt(0).toUpperCase() + source.slice(1)} registration failed. Please try again.`;
    } finally {
      this.isLoading = false;
    }
  }

  // ------------------------------------------------------------
  // 💾 Persistence & State Sync
  // ------------------------------------------------------------
  /** 💾 Save or check if user exists in local storage */
  private saveSocialUser(mappedUser: User) {
    // Load users from localStorage (or start with empty array)
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

    // Check if a user with the same email is already registered
    const existingUser = users.find(u => u.email === mappedUser.email);

    if (existingUser) {
      // If exists — show error and do not overwrite
      this.errorMessage = 'This email is already registered!';
      return;
    }

    // Add new user to users list and persist
    users.push(mappedUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(mappedUser));

    // Update shared services so app state knows the user
    this.data.user.set(mappedUser);
    this.auth.user.set(mappedUser);
    this.auth.isLoggedIn.set(true);

    // Notify and redirect to home
    this.message = `Registration successful via ${mappedUser.source}!`;
    this.router.navigate(['/']);
  }

  // ------------------------------------------------------------
  // 🧹 Utilities
  // ------------------------------------------------------------
  /** 🧹 Utility: clear old messages */
  private clearMessages() {
    this.message = '';
    this.errorMessage = '';
  }
}
