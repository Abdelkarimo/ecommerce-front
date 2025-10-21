import { Injectable, signal } from '@angular/core';
import { User } from '../interface/User';
import { Auth } from '../auth/auth';
import { SocialAuth } from '../auth/social-auth';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Data {
  user = signal<User | null>(null);
  private apiUrl = 'https://dummyjson.com/products';

  constructor(private auth: Auth, private social: SocialAuth, private http: HttpClient) {
    // ### Load the current user from Auth or SocialAuth
    const currentUser = auth.getCurrentUser() || social.getCurrentUser();
    if (currentUser) this.user.set(currentUser);
  }
  
  // ### 🛒 CART MANAGEMENT METHODS

  /** Add product to cart */
  addToCart(productId: number, quantity: number = 1): boolean {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser) return false;

    // Initialize cart if it doesn't exist
    if (!currentUser.cart) {
      currentUser.cart = [];
    }

    // Check if product already exists in cart
    const existingItem = currentUser.cart.find((item: any) => item.productId === productId);
    
    if (existingItem) {
      // Update quantity if product already exists
      existingItem.quantity += quantity;
    } else {
      // Add new product to cart
      currentUser.cart.push({
        productId: productId,
        quantity: quantity,
        addedAt: new Date().toISOString()
      });
    }

    this.updateCurrentUser(currentUser);
    return true;
  }

  /** Remove product from cart */
  removeFromCart(productId: number): boolean {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser || !currentUser.cart) return false;

    currentUser.cart = currentUser.cart.filter((item: any) => item.productId !== productId);
    this.updateCurrentUser(currentUser);
    return true;
  }

  /** Update product quantity in cart */
  updateCartQuantity(productId: number, quantity: number): boolean {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser || !currentUser.cart) return false;

    const item = currentUser.cart.find((item: any) => item.productId === productId);
    if (!item) return false;

    if (quantity <= 0) {
      return this.removeFromCart(productId);
    }

    item.quantity = quantity;
    this.updateCurrentUser(currentUser);
    return true;
  }

  /** Get cart items */
  getCartItems(): any[] {
    const currentUser = this.auth.getCurrentUser();
    return currentUser?.cart || [];
  }

  /** Clear entire cart */
  clearCart(): boolean {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser) return false;

    currentUser.cart = [];
    this.updateCurrentUser(currentUser);
    return true;
  }

  /** Get cart total items count */
  getCartItemsCount(): number {
    const cartItems = this.getCartItems();
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // ### ❤️ FAVOURITES MANAGEMENT METHODS

  /** Add product to favourites */
  addToFavourites(productId: number): boolean {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser) return false;

    // Initialize favourites if it doesn't exist
    if (!currentUser.favourites) {
      currentUser.favourites = [];
    }

    // Check if product already exists in favourites
    const exists = currentUser.favourites.some((item: any) => item.productId === productId);
    if (exists) return false; // Already in favourites

    currentUser.favourites.push({
      productId: productId,
      addedAt: new Date().toISOString()
    });

    this.updateCurrentUser(currentUser);
    return true;
  }

  /** Remove product from favourites */
  removeFromFavourites(productId: number): boolean {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser || !currentUser.favourites) return false;

    currentUser.favourites = currentUser.favourites.filter((item: any) => item.productId !== productId);
    this.updateCurrentUser(currentUser);
    return true;
  }

  /** Get favourites items */
  getFavouritesItems(): any[] {
    const currentUser = this.auth.getCurrentUser();
    return currentUser?.favourites || [];
  }

  /** Check if product is in favourites */
  isInFavourites(productId: number): boolean {
    const favourites = this.getFavouritesItems();
    return favourites.some((item: any) => item.productId === productId);
  }

  /** Clear all favourites */
  clearFavourites(): boolean {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser) return false;

    currentUser.favourites = [];
    this.updateCurrentUser(currentUser);
    return true;
  }

  /** Toggle product in favourites (add if not present, remove if present) */
  toggleFavourite(productId: number): boolean {
    if (this.isInFavourites(productId)) {
      return this.removeFromFavourites(productId);
    } else {
      return this.addToFavourites(productId);
    }
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
    this.auth.user.set(updatedUser);
    this.social.user.set(updatedUser);
  }

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}?limit=100`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  searchProducts(query: string): Observable<{ products: Product[] }> {
    return this.http.get<{ products: Product[] }>(`${this.apiUrl}/search?q=${query}`);
  }

  getFilteredCategories(term: string): Observable<{ products: Product[] }> {
    return this.http.get<{ products: Product[] }>(`${this.apiUrl}/category/${term}?limit=100`);
  }

  // Save order to localStorage
  saveOrder(order: any) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
  }

  // Get the last order from localStorage
  GetLastOrder() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    return orders.length ? orders[orders.length - 1] : null;
  }

  // Get all orders
  getAllOrders() {
    return JSON.parse(localStorage.getItem('orders') || '[]');
  }

}
