// products.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Products {
  private FAKE_API_DATA_URL: string = "https://dummyjson.com/products";

  // Private BehaviorSubjects (internal state)
  private cartProductsSubject = new BehaviorSubject<any[]>([
    {userId: 1, prodId: 1, amount: 2},
    {userId: 1, prodId: 5, amount: 2},
    {userId: 1, prodId: 3, amount: 2}
  ]);

  private favProductsSubject = new BehaviorSubject<any[]>([
    {userId: 1, prodId: 1},
    {userId: 1, prodId: 5},
    {userId: 1, prodId: 3}
  ]);

  private totalSumSubject = new BehaviorSubject<number>(0);

  private ordersSubject = new BehaviorSubject<any[]>([]);

  // Public Observables (components subscribe to these)
  public cartProducts$ = this.cartProductsSubject.asObservable();
  public favProducts$ = this.favProductsSubject.asObservable();
  public totalSum$ = this.totalSumSubject.asObservable();
  public orders$ = this.ordersSubject.asObservable();

  constructor(private myHttpClient: HttpClient) {}

  // ============= HTTP API Methods =============
  GetAllProducts(): Observable<any> {
    return this.myHttpClient.get(this.FAKE_API_DATA_URL);
  }

  GetProductsById(id: number): Observable<any> {
    return this.myHttpClient.get(`${this.FAKE_API_DATA_URL}/${id}`);
  }

  // ============= Cart Methods (Reactive) =============
  
  // Add item to cart
  addToCart(product: any): void {
    const currentCart = this.cartProductsSubject.value;
    const existingIndex = currentCart.findIndex((item: any) => item.prodId === product.prodId);
    
    if (existingIndex === -1) {
      // Product not in cart, add it
      this.cartProductsSubject.next([...currentCart, product]);
    } else {
      // Product exists, increment amount
      const updatedCart = [...currentCart];
      updatedCart[existingIndex].amount++;
      this.cartProductsSubject.next(updatedCart);
    }
  }

  // Update entire cart
  UpdateCartProducts(products: any[]): void {
    this.cartProductsSubject.next(products);
  }

  // Clear cart
  ClearCart(): void {
    this.cartProductsSubject.next([]);
    this.totalSumSubject.next(0);
  }

  // Get cart length (total items count)
  GetCartLength(): number {
    const cart = this.cartProductsSubject.value;
    if (cart.length === 0) return 0;
    
    return cart.reduce((total: number, item: any) => total + item.amount, 0);
  }

  // ============= Favorites Methods (Reactive) =============
  
  // Add to favorites
  addToFavorites(product: any): void {
    const currentFavs = this.favProductsSubject.value;
    const existingIndex = currentFavs.findIndex((item: any) => item.prodId === product.prodId);
    
    if (existingIndex === -1) {
      this.favProductsSubject.next([...currentFavs, product]);
    }
  }

  // Update favorites
  UpdateFavProducts(products: any[]): void {
    this.favProductsSubject.next(products);
    console.log('Favorites updated:', products);
    console.log('Current cart:', this.cartProductsSubject.value);
  }

  // Clear favorites
  ClearFavorites(): void {
    this.favProductsSubject.next([]);
  }

  // Get favorites length
  GetFavoritesLength(): number {
    return this.favProductsSubject.value.length;
  }

  // ============= Total Sum Methods =============
  
  UpdateTotalSum(sum: number): void {
    this.totalSumSubject.next(sum);
  }

  GetTotalSum(): number {
    return this.totalSumSubject.value;
  }

  // ============= Orders Methods (Reactive) =============
  
  SaveOrder(order: any): void {
    const currentOrders = this.ordersSubject.value;
    this.ordersSubject.next([...currentOrders, order]);
    console.log('Order saved:', order);
  }

  GetOrders(): any[] {
    return this.ordersSubject.value;
  }

  GetLastOrder(): any | null {
    const orders = this.ordersSubject.value;
    return orders.length ? orders[orders.length - 1] : null;
  }

  // ============= Backwards Compatibility Methods =============
  // Keep these for components that haven't been updated yet
  
  GetCartProducts(): any[] {
    return this.cartProductsSubject.value;
  }

  GetFavProducts(): any[] {
    return this.favProductsSubject.value;
  } }