/**
 * Cart Component
 * ----------------
 * Displays the user's shopping cart, including product details, quantity management, and total calculation.
 * Allows adding, deducting, removing items, and proceeding to checkout.
 */

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../../core/auth/auth';
import { Data } from '../../../core/services/data';

@Component({
  imports: [CommonModule, DecimalPipe],
  selector: 'app-cart',
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit {
  cartProductInfo: any; // Raw cart items from user data
  allProducts: any[] = []; // Full product details with quantity
  total: number = 0; // Total cart amount

  constructor(private auth: Auth, private dataService: Data, private router: Router) {}

  ngOnInit() {
    // 🔹 Get cart items from user data
    this.cartProductInfo = this.dataService.getCartItems();

    // 🔹 Load product details for each cart item
    this.cartProductInfo.forEach((item: any) => {
      this.dataService.getProductById(item.productId).subscribe({
        next: (data: any) => {
          this.allProducts.push({
            data,
            userId: this.auth.getCurrentUser()?.id,
            quantity: item.quantity,
            productId: item.productId
          });
          // 🔹 Update total price
          this.total += (data.price * (1 - data.discountPercentage / 100)) * item.quantity;
          this.total = Number(this.total.toFixed(2));
        },
        error: (error) => console.log(error)
      });
    });
  }

  /** ➕ Increase quantity of a product */
  addMore(prodId: any) {
    let designatedProd = this.allProducts.find((item: any) => item.data.id == prodId);
    designatedProd.quantity++;
    this.dataService.updateCartQuantity(prodId, designatedProd.quantity);

    this.total += designatedProd.data.price * (1 - designatedProd.data.discountPercentage / 100);
    this.total = Number(this.total.toFixed(2));
  }

  /** ➖ Decrease quantity of a product */
  deduct(prodId: number) {
    let designatedProd = this.allProducts.find((item: any) => item.data.id == prodId);
    designatedProd.quantity--;
    this.total -= designatedProd.data.price * (1 - designatedProd.data.discountPercentage / 100);
    this.total = Number(this.total.toFixed(2));

    if (designatedProd.quantity < 1) {
      // Remove completely if quantity is less than 1
      this.allProducts = this.allProducts.filter((item: any) => item.data.id !== prodId);
      this.dataService.removeFromCart(prodId);
    } else {
      // Update quantity in auth service
      this.dataService.updateCartQuantity(prodId, designatedProd.quantity);
    }
  }

  /** 🗑 Remove an item completely from cart */
  removeItem(prodId: any) {
    this.dataService.removeFromCart(prodId);
    this.allProducts = this.allProducts.filter((item: any) => item.data.id !== prodId);
    this.recalculateTotal();
  }

  /** 🔄 Recalculate the total price */
  recalculateTotal() {
    this.total = this.allProducts.reduce((sum: any, item: any) => {
      const price = item.data.price * (1 - (item.data.discountPercentage || 0) / 100);
      return sum + price * item.quantity;
    }, 0);
    this.total = Number(this.total.toFixed(2));
  }

  /** 🔖 TrackBy function for ngFor */
  trackById(index: number, item: any) {
    return item?.data?.id ?? index;
  }

  /** ➡ Navigate to checkout */
  proceedToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
