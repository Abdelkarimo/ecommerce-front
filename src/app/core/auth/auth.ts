import { Injectable, signal } from '@angular/core';
import { User } from '../interface/User';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  /** Signal to track login state (Angular 17+ feature) */
  isLoggedIn = signal<boolean>(false);

  /** Signal to hold the current user data */
  user = signal<User | null>(this.getCurrentUser());

  constructor() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.isLoggedIn.set(true);
    }
  }

  /**
   * 📝 Register a new user
   * @param formData - contains name, email, and password
   * @returns boolean - true if registration succeeds, false if user exists
   */
  register(formData: { email: string; password: string; name: string }): boolean {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

    const exists = users.find(u => u.email === formData.email);
    if (exists) {
      console.warn('User already exists!');
      return false;
    }

    // Assign role based on email
    const role = formData.email === 'admin@shop.com' ? 'admin' : 'user';

    // Create new user object
    const newUser: User = {
      id: crypto.randomUUID(),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role,
      source: 'normal',
      cart: [],
      favourites: []
    };

    // Save new user to localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    return true;
  }

  /**
   * 🔑 Login a user
   * @param formData - contains email and password
   * @returns boolean - true if login succeeds, false otherwise
   */
  login(formData: { email: string; password: string }): boolean {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

    const found = users.find(
      u => u.email === formData.email && u.password === formData.password
    );

    if (found) {
      localStorage.setItem('currentUser', JSON.stringify(found));
      this.isLoggedIn.set(true);
      this.user.set(found);
      return true;
    }

    return false;
  }

  /**
   * 🚪 Logout the current user
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    this.isLoggedIn.set(false);
    this.user.set(null);
  }

  /**
   * 🧾 Check if a user is currently logged in
   * @returns boolean
   */
  checkAuth(): boolean {
    return this.isLoggedIn();
  }

  /**
   * 👤 Get the current logged-in user
   * @returns User | null
   */
  getCurrentUser(): User | null {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  }
}
