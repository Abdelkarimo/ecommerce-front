// cart.component.ts - REFACTORED FOR REACTIVE APPROACH
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Products } from '../../../core/services/products.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class CartComponent implements OnInit, OnDestroy {
  allProducts: any[] = [];
  total: number = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private products: Products,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Subscribe to cart changes (reactive!)
    this.products.cartProducts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cartItems => {
        this.loadCartProducts(cartItems);
      });
  }

  loadCartProducts(cartItems: any[]): void {
    // Clear existing products and total
    this.allProducts = [];
    this.total = 0;

    if (cartItems.length === 0) {
      return;
    }

    // Fetch full product details for each cart item
    cartItems.forEach((item: any) => {
      this.products.GetProductsById(item.prodId).subscribe({
        next: (data: any) => {
          // Check if product already exists (prevent duplicates)
          const existingIndex = this.allProducts.findIndex(p => p.data.id === data.id);
          
          if (existingIndex === -1) {
            // Add new product
            this.allProducts.push({
              data,
              userId: item.userId,
              quantity: item.amount
            });
          } else {
            // Update existing product quantity
            this.allProducts[existingIndex].quantity = item.amount;
          }

          // Recalculate total after each product loads
          this.recalculateTotal();
        },
        error: (error) => console.log(error)
      });
    });
  }

  addMore(prodId: any): void {
    const designatedProd = this.allProducts.find((item: any) => item.data.id === prodId);
    
    if (designatedProd) {
      designatedProd.quantity++;
      
      // Recalculate and update service
      this.recalculateTotal();
      this.updateCartInService();
    }
  }

  deduct(prodId: number): void {
    const designatedProd = this.allProducts.find((item: any) => item.data.id === prodId);
    
    if (designatedProd) {
      designatedProd.quantity--;
      
      // Remove if quantity is less than 1
      if (designatedProd.quantity < 1) {
        this.allProducts = this.allProducts.filter((item: any) => item.data.id !== prodId);
      }
      
      // Recalculate and update service
      this.recalculateTotal();
      this.updateCartInService();
    }
  }

  removeItem(prodId: any): void {
    // Remove the product
    this.allProducts = this.allProducts.filter((item: any) => item.data.id !== prodId);
    
    // Recalculate and update service
    this.recalculateTotal();
    this.updateCartInService();
  }

  recalculateTotal(): void {
    this.total = this.allProducts.reduce((sum: number, item: any) => {
      const discountedPrice = item.data.price * (1 - (item.data.discountPercentage || 0) / 100);
      return sum + (discountedPrice * item.quantity);
    }, 0);
    
    this.total = Number(this.total.toFixed(2));
    
    // Update total in service
    this.products.UpdateTotalSum(this.total);
  }

  private updateCartInService(): void {
    if (this.allProducts.length === 0) {
      this.products.ClearCart();
    } else {
      const cartData = this.allProducts.map((item: any) => ({
        prodId: item.data.id,
        userId: item.userId,
        amount: item.quantity
      }));
      this.products.UpdateCartProducts(cartData);
    }
  }

  proceedToCheckout(): void {
    // Ensure total is saved before checkout
    this.products.UpdateTotalSum(this.total);
    this.router.navigate(['/checkout']);
  }

  trackById(index: number, item: any): any {
    return item?.data?.id ?? index;
  }

  ngOnDestroy(): void {
    // Final update before component is destroyed
    this.products.UpdateTotalSum(Number(this.total.toFixed(2)));
    this.updateCartInService();
    
    // Complete the subscription
    this.destroy$.next();
    this.destroy$.complete();
  }
}