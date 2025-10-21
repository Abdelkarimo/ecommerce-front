import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../../core/auth/auth';
import { Data } from '../../../core/services/data';

@Component({
  imports: [CommonModule, DecimalPipe],
  selector: 'app-cart',
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit,OnDestroy {
    cartProductInfo:any;
  allProducts:any=[];
  total:number=0;
constructor(private auth: Auth, private dataService: Data, private router: Router){}
  ngOnInit(){
    // Get cart items from user data
    this.cartProductInfo = this.dataService.getCartItems();
    
    // Load product details for each cart item
    this.cartProductInfo.forEach((item:any) => {
      this.dataService.getProductById(item.productId)
      .subscribe({next:(data:any)=>{
        this.allProducts.push({
          data, 
          userId: this.auth.getCurrentUser()?.id, 
          quantity: item.quantity,
          productId: item.productId
        });
        this.total += (data.price * (1 - data.discountPercentage/100)) * item.quantity;
        this.total = Number(this.total.toFixed(2));
      },error:(error)=>console.log(error)})
    });
   }
addMore(prodId:any){
  let designatedProd=this.allProducts.find((item:any)=>item.data.id==prodId)
  designatedProd.quantity++;
  // Update in auth service
  this.dataService.updateCartQuantity(prodId, designatedProd.quantity);
  this.total+=designatedProd.data.price*(1-designatedProd.data.discountPercentage/100);
  this.total = Number(this.total.toFixed(2));
}
deduct(prodId:number){
  let designatedProd=this.allProducts.find((item:any)=>item.data.id==prodId)
  designatedProd.quantity--;
  this.total-=designatedProd.data.price*(1-designatedProd.data.discountPercentage/100);
  this.total = Number(this.total.toFixed(2));
  
  if(designatedProd.quantity<1){
    this.allProducts=this.allProducts.filter((item:any)=>item.data.id!==prodId)
    // Remove from auth service
    this.dataService.removeFromCart(prodId);
  } else {
    // Update quantity in auth service
    this.dataService.updateCartQuantity(prodId, designatedProd.quantity);
  }
}
 
 removeItem(prodId:any){
   // Remove from auth service
   this.dataService.removeFromCart(prodId);
   // Remove from local array and recalculate total
   this.allProducts = this.allProducts.filter((item:any)=> item.data.id !== prodId);
   this.recalculateTotal();
 }

 recalculateTotal(){
   this.total = this.allProducts.reduce((sum:any, item:any) => {
     const price = item.data.price * (1 - (item.data.discountPercentage || 0) / 100);
     return sum + (price * item.quantity);
   }, 0);
   this.total = Number(this.total.toFixed(2));
 }

 trackById(index:number, item:any){
   return item?.data?.id ?? index;
 }
ngOnDestroy(): void {
  // Cart data is already managed by auth service
  // No need to manually update as it's handled in real-time
  console.log('Cart component destroyed. Cart data is managed by auth service.');
}

proceedToCheckout(){
  
  this.router.navigate(["/checkout"]);

}

  }
