import { Injectable, signal } from '@angular/core';
import { User } from '../interface/User';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  // Signal to track user state (Angular 17+ feature)
  isLoggedIn = signal<boolean>(false);
  // ### user signal to hold current user data
  user = signal<User | null>(this.getCurrentUser());

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

    
    // ### admin
    const role = formData.email === 'admin@shop.com' ? 'admin' : 'user';
    // ### create new user object
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

    // ### save new user
    users.push(newUser);
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
      // ### set user signal
      this.user.set(found);
      return true;
    }

    return false;
  }

  /** 🚪 Logout user */
  logout(): void {
    localStorage.removeItem('currentUser');
    this.isLoggedIn.set(false);
    // ### clear user signal
    this.user.set(null);
  }

  /** 🧾 Check if logged in */
  checkAuth(): boolean {
    return this.isLoggedIn();
  }

  /** 👤 Get current user data */
  getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

  // ### 🆕 Update current user data
  updateCurrentUser(updatedUser: User) {
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // also update the full users list
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }

    this.user.set(updatedUser); // 🆕 sync signal
  }
}
