import { Component, OnDestroy, OnInit } from '@angular/core';
import { Products } from '../../core/services/products.service';

@Component({
  selector: 'app-favorite',
  imports: [],
  templateUrl: './favourite.html'
})
export class Favourite implements OnInit,OnDestroy {
allFavoriteInfo:any=[];
allFavorites:any=[];
  constructor(private myProducts:Products){}
  ngOnInit(): void {
    this.allFavoriteInfo=this.myProducts.GetFavProducts();
    this.allFavoriteInfo.forEach((item:any) => {
      this.myProducts.GetProductsById(item.prodId).subscribe({next:(data:any)=>{
        this.allFavorites.push({data,userId:item.userId});
      }
      ,error:(error)=>console.log(error)})
    });
  console.log(this.allFavorites);
  }
  RemoveFromWishlist(prodId:number){
    this.allFavorites=this.allFavorites.filter((item:any)=>item.data.id!==prodId)
  }
  AddToCart(prodId:number){
    let addedItem=this.allFavorites.find((item:any)=>item.data.id==prodId);
    this.allFavorites=this.allFavorites.filter((item:any)=>item.data.id!==prodId);
    this.myProducts.addToCart({prodId:addedItem.data.id,userId:addedItem.userId,amount:1});
  }
  ngOnDestroy(): void {
     if(this.allFavorites.length==0){
    this.myProducts.ClearFavorites();
  }
  else{
    this.allFavoriteInfo=this.allFavorites.map((item:any)=>{
  return {prodId:item.data.id,userId:item.userId}

})
this.myProducts.UpdateFavProducts(this.allFavoriteInfo);
  }
}
}