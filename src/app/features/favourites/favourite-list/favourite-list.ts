import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../core/auth/auth';
import { Data } from '../../../core/services/data';

@Component({
  selector: 'app-favourite-list',
  imports: [CommonModule],
  templateUrl: './favourite-list.html',
  styleUrl: './favourite-list.css'
})
export class FavouriteList implements OnInit,OnDestroy {
  allFavoriteInfo:any=[];
  allFavorites:any=[];
    constructor(private auth: Auth, private dataService: Data){}
    ngOnInit(): void {
      // Get favourites from user data
      this.allFavoriteInfo = this.dataService.getFavouritesItems();
      
      // Load product details for each favourite item
      this.allFavoriteInfo.forEach((item:any) => {
        this.dataService.getProductById(item.productId).subscribe({
          next:(data:any)=>{
            this.allFavorites.push({
              data,
              userId: this.auth.getCurrentUser()?.id,
              productId: item.productId
            });
          },
          error:(error)=>console.log(error)
        })
      });
    console.log(this.allFavorites);
    }
    RemoveFromWishlist(prodId:number){
      // Remove from auth service
      this.dataService.removeFromFavourites(prodId);
      // Remove from local array
      this.allFavorites=this.allFavorites.filter((item:any)=>item.data.id!==prodId);
    }
    AddToCart(prodId:number){
      // Add to cart using auth service
      this.dataService.addToCart(prodId, 1);
      // Remove from favourites
      this.RemoveFromWishlist(prodId);
    }
    
    trackById(index:number, item:any){
      return item?.data?.id ?? index;
    }
    ngOnDestroy(): void {
      // Favourites data is already managed by auth service
      // No need to manually update as it's handled in real-time
      console.log('Favourites component destroyed. Favourites data is managed by auth service.');
    }
}
