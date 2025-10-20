import { Component, OnInit } from '@angular/core';
import { Products } from '../../../core/services/products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [],
  templateUrl: './checkout.html',
})
export class Checkout implements OnInit{
  total:number=0;
  constructor(private myProducts:Products,private router:Router){}
  ngOnInit(): void {
    this.total=this.myProducts.GetTotalSum();
    if(this.total==0)  this.router.navigate(["/landing"]);
  }

}
