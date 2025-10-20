import { HttpClient } from '@angular/common/http';
import {  Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class Products {
  
  private cartProducts=[{userId:1,prodId:1,amount:2},{userId:1,prodId:5,amount:2},{userId:1,prodId:3,amount:2}] //testing
  private favProducts=[{userId:1,prodId:1},{userId:1,prodId:5},{userId:1,prodId:3}]
  private totalSum=0;

  constructor(private myHttpClient:HttpClient){}
  private FAKE_API_DATA_URL:string="https://dummyjson.com/products"
  GetAllProducts(){
   return this.myHttpClient.get(this.FAKE_API_DATA_URL);
  }
  GetProductsById( id:number){
    return this.myHttpClient.get(`${this.FAKE_API_DATA_URL}/${id}`)
   }
  GetCartProducts(){
    return this.cartProducts;
   }
  GetCartLength(){
    if(this.cartProducts.length==0) return 0;
    else {
      let length=0;
      this.cartProducts.forEach((item:any)=>{
        length+=item.length;
      })
      return length;
    }
  }
   UpdateCartProducts(products:any){
    this.cartProducts=products;
   }
   addToCart(product:any){
    if(this.cartProducts.length==0) this.cartProducts.push(product);
    else{
      let prodExistIndex=this.cartProducts.findIndex((item:any)=>item.prodId==product.prodId);
      if(prodExistIndex==-1){
        this.cartProducts.push(product);
      }
      else{
        this.cartProducts[prodExistIndex].amount++;
      }
    }
  }
   ClearCart(){
    this.cartProducts=[];
   }
   GetFavProducts(){
    return this.favProducts;
   }
     GetFavoritesLength(){
    return this.favProducts.length;
  }
   UpdateFavProducts(products:any){
     this.favProducts=products;
     console.log(this.favProducts);
     console.log(this.cartProducts);
   }
    addToFavorites(product:any){
      if(this.favProducts.length==0) this.favProducts.push(product);
    else{
      let prodExistIndex=this.favProducts.findIndex((item:any)=>item.prodId==product.prodId);
      if(prodExistIndex==-1) this.favProducts.push(product);
    }
    }
    ClearFavorites(){
      this.favProducts=[];
    }
   GetTotalSum(){
    return this.totalSum;
   }
   UpdateTotalSum(sum:number){
    this.totalSum=sum;
   }
}
