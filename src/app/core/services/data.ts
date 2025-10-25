import { Injectable, EventEmitter, signal } from '@angular/core';
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
  /** Current logged-in user signal */
  user = signal<User | null>(null);

  /** Base API URL */
  private apiUrl = 'https://dummyjson.com/products';

  /** Events for reactive UI updates */
  favouritesChanged = new EventEmitter<void>();
  cartChanged = new EventEmitter<void>();

  constructor(
    private auth: Auth,
    private social: SocialAuth,
    private http: HttpClient
  ) {
    // Initialize user from Auth or SocialAuth
    const currentUser = auth.getCurrentUser() || social.getCurrentUser();
    if (currentUser) this.user.set(currentUser);
  }

  // ===================== CART METHODS =====================
  
  addToCart(productId: number, quantity: number = 1): boolean {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser) return false;

    currentUser.cart = currentUser.cart || [];
    const existing = currentUser.cart.find((item: any) => item.productId === productId);

    if (existing) existing.quantity += quantity;
    else currentUser.cart.push({ productId, quantity, addedAt: new Date().toISOString() });

    this.updateCurrentUser(currentUser);
    this.cartChanged.emit();
    return true;
  }

  removeFromCart(productId: number): boolean {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser || !currentUser.cart) return false;

    currentUser.cart = currentUser.cart.filter((item: any) => item.productId !== productId);
    this.updateCurrentUser(currentUser);
    this.cartChanged.emit();
    return true;
  }

  updateCartQuantity(productId: number, quantity: number): boolean {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser || !currentUser.cart) return false;

    const item = currentUser.cart.find((i: any) => i.productId === productId);
    if (!item) return false;

    if (quantity <= 0) return this.removeFromCart(productId);

    item.quantity = quantity;
    this.updateCurrentUser(currentUser);
    this.cartChanged.emit();
    return true;
  }

  getCartItems(): any[] {
    const currentUser = this.auth.getCurrentUser();
    return currentUser?.cart || [];
  }

  clearCart(): boolean {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser) return false;

    currentUser.cart = [];
    this.updateCurrentUser(currentUser);
    return true;
  }

  getCartItemsCount(): number {
    return this.getCartItems().reduce((total, item) => total + item.quantity, 0);
  }

  // ===================== FAVOURITES METHODS =====================

  getFavouritesItems(): any[] {
    const currentUser = this.auth.getCurrentUser();
    return currentUser?.favourites || [];
  }

  addToFavourites(productId: number): boolean {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser) return false;

    currentUser.favourites = currentUser.favourites || [];
    if (currentUser.favourites.some((i: any) => i.productId === productId)) return false;

    currentUser.favourites.push({ productId, addedAt: new Date().toISOString() });
    this.updateCurrentUser(currentUser);
    this.favouritesChanged.emit();
    return true;
  }

  removeFromFavourites(productId: number): boolean {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser || !currentUser.favourites) return false;

    currentUser.favourites = currentUser.favourites.filter((i: any) => i.productId !== productId);
    this.updateCurrentUser(currentUser);
    this.favouritesChanged.emit();
    return true;
  }

  toggleFavourite(productId: number): boolean {
    return this.isInFavourites(productId)
      ? this.removeFromFavourites(productId)
      : this.addToFavourites(productId);
  }

  isInFavourites(productId: number): boolean {
    return this.getFavouritesItems().some((i: any) => i.productId === productId);
  }

  getFavouritesCount(): number {
    return this.getFavouritesItems().length;
  }

  clearFavourites(): boolean {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser) return false;

    currentUser.favourites = [];
    this.updateCurrentUser(currentUser);
    this.favouritesChanged.emit();
    return true;
  }

  // ===================== USER METHODS =====================

  updateCurrentUser(updatedUser: User) {
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }

    this.user.set(updatedUser);
    this.auth.user.set(updatedUser);
    this.social.user.set(updatedUser);
  }

  // ===================== PRODUCT API METHODS =====================

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}?limit=100`);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  searchProducts(query: string): Observable<{ products: Product[] }> {
    return this.http.get<{ products: Product[] }>(`${this.apiUrl}/search?q=${query}`);
  }

  getFilteredCategories(category: string): Observable<{ products: Product[] }> {
    return this.http.get<{ products: Product[] }>(`${this.apiUrl}/category/${category}?limit=100`);
  }

  // ===================== ORDER METHODS =====================

  saveOrder(order: any) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
  }

  GetLastOrder() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    return orders.length ? orders[orders.length - 1] : null;
  }

  getAllOrders() {
    return JSON.parse(localStorage.getItem('orders') || '[]');
  }
}
