import { Injectable, signal } from '@angular/core';
import { User } from '../interface/User';
import { Auth } from '../auth/auth';
import { SocialAuth } from '../auth/social-auth';

@Injectable({
  providedIn: 'root'
})
export class Data {

  user = signal<User | null>(null);

  constructor(private auth: Auth, private social: SocialAuth) {
    // ### Load the current user from Auth or SocialAuth
    const currentUser = auth.getCurrentUser() || social.getCurrentUser();
    if (currentUser) this.user.set(currentUser);
  }

  // ### Add to cart
  addToCart(product: any) {
    const current = this.user();
    if (!current) return;
    current.cart = current.cart || [];
    current.cart.push(product);
    this.saveUser(current);
  }

  // ### Add to favourites
  addToFavourites(product: any) {
    const current = this.user();
    if (!current) return;
    current.favourites = current.favourites || [];
    current.favourites.push(product);
    this.saveUser(current);
  }

  // ### Save updates to localStorage and update signals
  private saveUser(updatedUser: User) {
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // ### Update in users array
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
    } else {
      users.push(updatedUser);
    }
    localStorage.setItem('users', JSON.stringify(users));

    // ### Update signals
    this.user.set(updatedUser);
    this.auth.user.set(updatedUser);
    this.social.user.set(updatedUser);
  }
}



