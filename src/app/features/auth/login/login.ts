import { Component, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../core/auth/auth';
import { Data } from '../../../core/services/data';
import { User } from '../../../core/interface/User';

// 🔹 Firebase Authentication imports
import {
  getAuth,
  signInWithPopup,
  FacebookAuthProvider,
  GoogleAuthProvider,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  OAuthCredential,
} from '@angular/fire/auth';

/**
 * 🔐 Login Component
 * ------------------------------------------------------------
 * Handles user authentication using:
 *  - Email/password (local authentication)
 *  - Google sign-in (OAuth)
 *  - Facebook sign-in (OAuth)
 * 
 * Responsibilities:
 *  - Validate login credentials
 *  - Manage authentication state
 *  - Handle social login conflicts and linking
 *  - Redirect users post-login
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements AfterViewInit {
  /** 📋 Form data for local login */
  formData = { email: '', password: '' };

  /** ⚠️ Error message displayed on login failure */
  errorMessage = '';

  /** Temporary flag to hold login result */
  temp = false;

  constructor(
    private router: Router,
    public auth: Auth,
    private data: Data
  ) {}

  // ------------------------------------------------------------
  // 🖱️ Lifecycle Hooks
  // ------------------------------------------------------------

  ngAfterViewInit() {
    // Automatically scroll to the login section once the page loads
    setTimeout(() => {
      const element = document.getElementById('login');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  // ------------------------------------------------------------
  // 🔐 Normal Email/Password Login
  // ------------------------------------------------------------

  onSubmit() {
    this.errorMessage = '';
    this.temp = this.auth.login(this.formData); // Call Auth service for validation

    if (!this.temp) {
      this.errorMessage = 'Invalid email or password.';
    } else {
      this.router.navigate(['/']); // Redirect to home on success
    }
  }

  // ------------------------------------------------------------
  // 🌐 Google Authentication
  // ------------------------------------------------------------

  async loginWithGoogle() {
    const firebaseAuth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const gUser = result.user;

      const mappedUser: User = {
        id: gUser.uid,
        name: gUser.displayName || 'Unknown User',
        email: gUser.email || '',
        role: 'user',
        source: 'google',
        picture: gUser.photoURL || '',
        cart: [],
        favourites: [],
      };

      this.handleSocialUser(mappedUser);
    } catch (error) {
      console.error('Google login error:', error);
      this.errorMessage = 'Google login failed. Please try again.';
    }
  }

  // ------------------------------------------------------------
  // 📘 Facebook Authentication
  // ------------------------------------------------------------

  async loginWithFacebook() {
    const firebaseAuth = getAuth();
    const provider = new FacebookAuthProvider();

    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const fbUser = result.user;

      const mappedUser: User = {
        id: fbUser.uid,
        name: fbUser.displayName || 'Unknown User',
        email: fbUser.email || '',
        role: 'user',
        source: 'facebook',
        picture: fbUser.photoURL || '',
        cart: [],
        favourites: [],
      };

      this.handleSocialUser(mappedUser);
    } catch (error: any) {
      console.error('Facebook login error:', error);

      // Handle case where same email is linked to another provider (e.g. Google)
      if (error.code === 'auth/account-exists-with-different-credential') {
        const pendingCred = FacebookAuthProvider.credentialFromError(error) as OAuthCredential;
        const email = error.customData?.email;

        if (!email) {
          this.errorMessage = 'Could not retrieve email from Facebook.';
          return;
        }

        const methods = await fetchSignInMethodsForEmail(firebaseAuth, email);
        console.log('Existing sign-in methods:', methods);

        // ⚠️ If user is already registered with Google
        if (methods.includes('google.com')) {
          alert('This email is registered with Google. Please sign in with Google.');

          const googleProvider = new GoogleAuthProvider();
          const googleResult = await signInWithPopup(firebaseAuth, googleProvider);

          if (googleResult.user) {
            await linkWithCredential(googleResult.user, pendingCred);

            const linkedUser: User = {
              id: googleResult.user.uid,
              name: googleResult.user.displayName || 'Unknown User',
              email: googleResult.user.email || '',
              role: 'user',
              source: 'google',
              picture: googleResult.user.photoURL || '',
              cart: [],
              favourites: [],
            };

            this.handleSocialUser(linkedUser);
          }
        } else {
          this.errorMessage = 'This email is registered differently. Try another login method.';
        }
      } else if (error.code === 'auth/popup-closed-by-user') {
        console.warn('User closed the Facebook login popup.');
      } else {
        this.errorMessage = 'Facebook login failed. Please try again.';
      }
    }
  }

  // ------------------------------------------------------------
  // 🧩 Common Handler for Social Users (Google / Facebook)
  // ------------------------------------------------------------

  private handleSocialUser(mappedUser: User) {
    // Retrieve existing users from localStorage
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find((u) => u.email === mappedUser.email);

    if (existingUser) {
      // ✅ Existing user → log in directly
      this.data['user'].set(existingUser);
      localStorage.setItem('currentUser', JSON.stringify(existingUser));
      this.auth.isLoggedIn.set(true);
      this.router.navigate(['/']);
    } else {
      // 🚀 New user → save and redirect to registration
      users.push(mappedUser);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify(mappedUser));

      // Sync user data across services
      this.data['user'].set(mappedUser);
      this.auth.user.set(mappedUser);
      this.auth.isLoggedIn.set(true);

      this.router.navigate(['/register']); // or '/' for auto-registration
    }
  }
}
