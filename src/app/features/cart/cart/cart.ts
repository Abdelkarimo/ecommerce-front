import { Component, OnDestroy, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Products } from '../../../core/services/products.service';

@Component({
  imports:[CurrencyPipe],
  selector: 'app-cart',
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit,OnDestroy {
    cartProductInfo:any;
  allProducts:any=[];
  total:number=0;
constructor(private products:Products,private router: Router){}
  ngOnInit(){
    this.cartProductInfo=this.products.GetCartProducts();
    this.cartProductInfo.forEach((item:any) => {
      this.products.GetProductsById(item.prodId)
      .subscribe({next:(data:any)=>{
        this.allProducts.push({data,userId:item.userId,quantity:item.amount});
          this.total+=(data.price*(1-data.discountPercentage/100))*item.amount;
          this.total=Number(this.total.toFixed(2));
      },error:(error)=>console.log(error)})
    });

   }
addMore(prodId:any){
  let designatedProd=this.allProducts.find((item:any)=>item.data.id==prodId)
  designatedProd.quantity++;
this.total+=designatedProd.data.price*(1-designatedProd.data.discountPercentage/100);
}
deduct(prodId:number){
  let designatedProd=this.allProducts.find((item:any)=>item.data.id==prodId)
  designatedProd.quantity--;
  this.total-=designatedProd.data.price*(1-designatedProd.data.discountPercentage/100);
  if(designatedProd.quantity<1){
    this.allProducts=this.allProducts.filter((item:any)=>item.data.id!==prodId)
  }
}
ngOnDestroy(): void {
  this.products.UpdateTotalSum(Number(this.total.toFixed(2)));
  if(this.allProducts.length==0){
    this.products.ClearCart();
  }
  else{
    this.cartProductInfo=this.allProducts.map((item:any)=>{
  return {prodId:item.data.id,userId:item.userId,amount:item.quantity}
})
  this.products.UpdateCartProducts(this.cartProductInfo);

  }

}

proceedToCheckout(){
  
  this.router.navigate(["/checkout"]);

}

  }
