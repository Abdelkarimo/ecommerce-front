import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../core/auth/auth';
import { Data } from '../../../core/services/data';
import { User } from '../../../core/interface/User';

// 🔹 Firebase imports
import {
  getAuth,
  signInWithPopup,
  FacebookAuthProvider,
  GoogleAuthProvider,
} from '@angular/fire/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
  imports: [FormsModule, RouterLink, RouterLinkActive],
})
export class Register {
  formData = { name: '', email: '', password: '' };
  message = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private auth: Auth,
    private data: Data,
    private router: Router
  ) {}

  /** 📝 Normal registration */
  onSubmit() {
    this.clearMessages();
    const success = this.auth.register(this.formData);

    if (success) {
      this.message = 'Registration successful! You can now login.';
    } else {
      this.errorMessage = 'Email already exists!';
    }
  }

  /** 🌐 Register via Google */
  async registerWithGoogle() {
    await this.handleSocialLogin(new GoogleAuthProvider(), 'google');
  }

  /** 📘 Register via Facebook */
  async registerWithFacebook() {
    await this.handleSocialLogin(new FacebookAuthProvider(), 'facebook');
  }

  /** 🧩 Unified handler for Google/Facebook registration */
  private async handleSocialLogin(provider: any, source: 'google' | 'facebook') {
    this.clearMessages();
    this.isLoading = true;

    const firebaseAuth = getAuth();

    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;

      if (!user.email) {
        this.errorMessage = 'Could not retrieve your email. Please try again.';
        return;
      }

      const mappedUser: User = {
        id: user.uid,
        name: user.displayName || 'Unknown User',
        email: user.email,
        role: 'user',
        source,
        picture: user.photoURL || '',
        cart: [],
        favourites: [],
      };

      this.saveSocialUser(mappedUser);
    } catch (error) {
      console.error(`${source} registration error:`, error);
      this.errorMessage = `${source.charAt(0).toUpperCase() + source.slice(1)} registration failed. Please try again.`;
    } finally {
      this.isLoading = false;
    }
  }

  /** 💾 Save or check if user exists in local storage */
  private saveSocialUser(mappedUser: User) {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const existingUser = users.find(u => u.email === mappedUser.email);

    if (existingUser) {
      this.errorMessage = 'This email is already registered!';
      return;
    }

    // ✅ Add new user and persist
    users.push(mappedUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(mappedUser));

    // ✅ Update state across services
    this.data.user.set(mappedUser);
    this.auth.user.set(mappedUser);
    this.auth.isLoggedIn.set(true);

    this.message = `Registration successful via ${mappedUser.source}!`;
    this.router.navigate(['/']); // redirect to home
  }

  /** 🧹 Utility: clear old messages */
  private clearMessages() {
    this.message = '';
    this.errorMessage = '';
  }
}
