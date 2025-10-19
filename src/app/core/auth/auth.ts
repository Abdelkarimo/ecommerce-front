import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  // Signal to track user state (Angular 17+ feature)
  isLoggedIn = signal<boolean>(false);

  constructor() {
    const user = localStorage.getItem('currentUser');
    if (user) this.isLoggedIn.set(true);
  }

  /** 📝 Register new user */
  register(formData: { email: string; password: string; name: string }): boolean {
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const exists = users.find((u: any) => u.email === formData.email);
    if (exists) {
      console.warn('User already exists!');
      return false;
    }

    users.push(formData);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  }

  /** 🔑 Login user */
  login(formData: { email: string; password: string }): boolean {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
     console.log(formData);
    const found = users.find(
      (u: any) => u.email === formData.email && u.password === formData.password
    );

    if (found) {
      localStorage.setItem('currentUser', JSON.stringify(found));
      this.isLoggedIn.set(true);
      return true;
    }

    return false;
  }

  /** 🚪 Logout user */
  logout(): void {
    localStorage.removeItem('currentUser');
    this.isLoggedIn.set(false);
  }

  /** 🧾 Check if logged in */
  checkAuth(): boolean {
    return this.isLoggedIn();
  }

  /** 👤 Get current user data */
  getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  }
}
