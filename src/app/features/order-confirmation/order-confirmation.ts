import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Products } from '../../core/services/products.service';
import { CommonModule } from '@angular/common';

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

  constructor(private products: Products, private router: Router) {}

  ngOnInit(): void {
    // Try to fetch the last saved order from the service
    const last = this.products.GetLastOrder();
    if (last) {
      this.orderId = last.orderId;
      this.amount = last.amount;
      this.userId = last.userId;
    }

    // start redirect timer
    const timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(timer);
        this.router.navigate(['/landing']);
      }
    }, 1000);
  }
}
