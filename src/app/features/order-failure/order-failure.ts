import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Data } from '../../core/services/data';



@Component({
  selector: 'app-order-failure',
  imports: [],
  templateUrl: './order-failure.html',
  styleUrls: ['./order-failure.css']
})
export class OrderFailure implements OnInit {

constructor(private dataService: Data, private router: Router) {}
countdown: number = 5;
lastOrder:any=null;
ngOnInit(): void {
    // Start countdown timer for redirection
    this.lastOrder = this.dataService.GetLastOrder();
    if(this.lastOrder){
      this.dataService.removeOrder(this.lastOrder.orderId);
    }
    const timer = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(timer);
        this.router.navigate(['/checkout']);
      }
    }, 1000);
  }

}
