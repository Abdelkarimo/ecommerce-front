/**
 * OrderConfirmation Component
 * Displays order confirmation details after successful checkout,
 * shows a countdown, and redirects the user back to the landing page.
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Data } from '../../core/services/data';
import { Auth } from '../../core/auth/auth';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.html',
  imports: [CommonModule]
})
export class OrderConfirmation implements OnInit {
  orderId: string = '';
  amount: number = 0;
  userId: any = null;
  countdown: number = 5;
  order: any = null;
  hasOrder: boolean = false;

  constructor(private dataService: Data, private router: Router,private auth:Auth) {}

  ngOnInit(): void {
    // Fetch the last saved order from the data service
    const lastOrder = this.dataService.GetLastOrder();
     this.dataService.clearCart();
    if (lastOrder) {
      this.order = lastOrder;
      this.orderId = lastOrder.orderId;
      this.amount = lastOrder.amount;
      this.userId = lastOrder.userId;
      this.hasOrder = true;
    } else {
     
      // No order found — redirect to landing page after a short delay
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 2000);
    }

    // Start countdown timer for redirection
    const timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(timer);
        this.router.navigate(['/']);
      }
    }, 1000);
  }
}
