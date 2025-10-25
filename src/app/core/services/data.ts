import { EventEmitter, Injectable, signal } from '@angular/core';
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
  /** Reactive signal to store the currently logged-in user */
  user = signal<User | null>(null);

  /** Base API endpoint for products */
  private apiUrl = 'https://dummyjson.com/products';

  /** Events emitted when cart or favourites change */
  favouritesChanged = new EventEmitter<void>();
  cartChanged = new EventEmitter<void>();

  constructor(
    private auth: Auth,
    private social: SocialAuth,
    private http: HttpClient
  ) {
    // Load the current user from either Auth or SocialAuth
    const currentUser = auth.getCurrentUser() || social.getCurrentUser();
    if (currentUser) this.user.set(currentUser);
  }

  // ============================================================
  // 🛒 CART MANAGEMENT METHODS
  // ============================================================

  /**
   * Add a product to the cart.
   * If it already exists, the quantity is increased.
   * @param productId The product ID.
   * @param quantity Quantity to add (default: 1).
   * @returns true if added successfully, false otherwise.
   */
  addToCart(productId: number, quantity: number = 1): boolean {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser) return false;

    if (!currentUser.cart) currentUser.cart = [];

    const existingItem = currentUser.cart.find((item: any) => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentUser.cart.push({
        productId,
        quantity,
        addedAt: new Date().toISOString(),
      });
    }

    this.updateCurrentUser(currentUser);
    this.cartChanged.emit();
    return true;
  }

  /**
   * Remove a product from the cart by ID.
   * @param productId Product ID to remove.
   * @returns true if removed, false otherwise.
   */
  removeFromCart(productId: number): boolean {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser || !currentUser.cart) return false;

    currentUser.cart = currentUser.cart.filter((item: any) => item.productId !== productId);
    this.updateCurrentUser(currentUser);
    this.cartChanged.emit();
    return true;
  }

  /**
   * Update the quantity of a product in the cart.
   * @param productId Product ID.
   * @param quantity New quantity.
   * @returns true if updated, false otherwise.
   */
  updateCartQuantity(productId: number, quantity: number): boolean {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser || !currentUser.cart) return false;

    const item = currentUser.cart.find((item: any) => item.productId === productId);
    if (!item) return false;

    if (quantity <= 0) {
      this.cartChanged.emit();
      return this.removeFromCart(productId);
    }

    item.quantity = quantity;
    this.updateCurrentUser(currentUser);
    this.cartChanged.emit();
    return true;
  }

  /**
   * Get all items in the current user's cart.
   */
  getCartItems(): any[] {
    const currentUser = this.auth.getCurrentUser();
    return currentUser?.cart || [];
  }

  /**
   * Clear all products from the cart.
   * @returns true if cleared, false otherwise.
   */
  clearCart(): boolean {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser) return false;

    currentUser.cart = [];
    this.updateCurrentUser(currentUser);
    return true;
  }

  /**
   * Get the total number of products (quantities combined) in the cart.
   */
  getCartItemsCount(): number {
    const cartItems = this.getCartItems();
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }

  // ============================================================
  // ❤️ FAVOURITES MANAGEMENT METHODS
  // ============================================================

  /**
   * Get the total number of favourite products.
   */
  getFavouritesCount(): number {
    const favouritItems = this.getFavouritesItems();
    console.log(4);
    return favouritItems.length;
  }

  /**
   * Add a product to favourites.
   * @param productId Product ID.
   * @returns true if added successfully, false otherwise.
   */
  addToFavourites(productId: number): boolean {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser) return false;

    if (!currentUser.favourites) currentUser.favourites = [];

    const exists = currentUser.favourites.some((item: any) => item.productId === productId);
    if (exists) return false;

    currentUser.favourites.push({
      productId,
      addedAt: new Date().toISOString(),
    });
    this.favouritesChanged.emit();

    this.updateCurrentUser(currentUser);
    return true;
  }

  /**
   * Remove a product from favourites.
   * @param productId Product ID to remove.
   * @returns true if removed, false otherwise.
   */
  removeFromFavourites(productId: number): boolean {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser || !currentUser.favourites) return false;

    currentUser.favourites = currentUser.favourites.filter(
      (item: any) => item.productId !== productId
    );

    this.favouritesChanged.emit();
    this.updateCurrentUser(currentUser);
    return true;
  }

  /**
   * Get all favourite products for the current user.
   */
  getFavouritesItems(): any[] {
    const currentUser = this.auth.getCurrentUser();
    return currentUser?.favourites || [];
  }

  /**
   * Check if a specific product is already in favourites.
   * @param productId Product ID.
   * @returns true if the product is in favourites.
   */
  isInFavourites(productId: number): boolean {
    const favourites = this.getFavouritesItems();
    return favourites.some((item: any) => item.productId === productId);
  }

  /**
   * Remove all products from favourites.
   * @returns true if cleared, false otherwise.
   */
  clearFavourites(): boolean {
    const currentUser = this.auth.getCurrentUser();
    if (!currentUser) return false;

    currentUser.favourites = [];
    this.updateCurrentUser(currentUser);
    this.favouritesChanged.emit();
    return true;
  }

  /**
   * Toggle a product's favourite status (add/remove).
   * @param productId Product ID.
   * @returns true if changed successfully.
   */
  toggleFavourite(productId: number): boolean {
    let changed = false;

    if (this.isInFavourites(productId)) {
      changed = this.removeFromFavourites(productId);
    } else {
      changed = this.addToFavourites(productId);
    }

    if (changed) this.favouritesChanged.emit();
    return changed;
  }

  // ============================================================
  // 🔁 USER MANAGEMENT METHODS
  // ============================================================

  /**
   * Update current user information in localStorage and signals.
   * @param updatedUser Updated user object.
   */
  updateCurrentUser(updatedUser: User) {
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = updatedUser;
      localStorage.setItem('users', JSON.stringify(users));
    }

    this.user.set(updatedUser);
    this.auth.user.set(updatedUser);
    this.social.user.set(updatedUser);
  }

  // ============================================================
  // 🧩 PRODUCT METHODS (API CALLS)
  // ============================================================

  /** Fetch all products (limit: 100) */
  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}?limit=100`);
  }

  /** Fetch a single product by ID */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /** Search for products by query string */
  searchProducts(query: string): Observable<{ products: Product[] }> {
    return this.http.get<{ products: Product[] }>(`${this.apiUrl}/search?q=${query}`);
  }

  /** Get all products from a specific category */
  getFilteredCategories(term: string): Observable<{ products: Product[] }> {
    return this.http.get<{ products: Product[] }>(`${this.apiUrl}/category/${term}?limit=100`);
  }

  // ============================================================
  // 🧾 ORDER MANAGEMENT
  // ============================================================

  /**
   * Save an order to localStorage.
   * @param order The order object.
   */
  saveOrder(order: any) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
  }

  /**
   * Retrieve the most recent order from localStorage.
   */
  GetLastOrder() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    return orders.length ? orders[orders.length - 1] : null;
  }

  /**
   * Get all saved orders from localStorage.
   */
  getAllOrders() {
    return JSON.parse(localStorage.getItem('orders') || '[]');
  }
}
