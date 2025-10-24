import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Data } from '../../core/services/data';

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

  constructor(private dataService: Data, private router: Router) {}

  ngOnInit(): void {
    // Try to fetch the last saved order from the service
    const lastOrder = this.dataService.GetLastOrder();
    if (lastOrder) {
      this.order = lastOrder;
      this.orderId = lastOrder.orderId;
      this.amount = lastOrder.amount;
      this.userId = lastOrder.userId;
      this.hasOrder = true;
    } else {
      // If no order found, redirect to landing page after a short delay
      setTimeout(() => {
        this.router.navigate(['/products']);
      }, 2000);
    }

    // start redirect timer
    const timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(timer);
        this.router.navigate(['/products']);
      }
    }, 1000);
  }
}
