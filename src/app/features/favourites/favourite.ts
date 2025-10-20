// favourite.component.ts - REFACTORED FOR REACTIVE APPROACH
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Products } from '../../core/services/products.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './favourite.html'
})
export class FavouriteComponent implements OnInit, OnDestroy {
  allFavorites: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(private myProducts: Products) {}

  ngOnInit(): void {
    // Subscribe to favorites changes (reactive!)
    this.myProducts.favProducts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(favItems => {
        this.loadFavoriteProducts(favItems);
      });
  }

  loadFavoriteProducts(favItems: any[]): void {
    // Clear existing favorites
    this.allFavorites = [];

    if (favItems.length === 0) {
      return;
    }

    // Fetch full product details for each favorite
    favItems.forEach((item: any) => {
      this.myProducts.GetProductsById(item.prodId).subscribe({
        next: (data: any) => {
          // Only add if not already in the array (prevent duplicates)
          const exists = this.allFavorites.some(fav => fav.data.id === data.id);
          if (!exists) {
            this.allFavorites.push({ data, userId: item.userId });
          }
        },
        error: (error) => console.log(error)
      });
    });

    console.log('Favorites loaded:', this.allFavorites);
  }

  RemoveFromWishlist(prodId: number): void {
    // Remove from local array
    this.allFavorites = this.allFavorites.filter((item: any) => item.data.id !== prodId);
    
    // Update service (triggers reactive update for all subscribers)
    this.updateFavoritesInService();
  }

  AddToCart(prodId: number): void {
    // Find the item to add
    const addedItem = this.allFavorites.find((item: any) => item.data.id === prodId);
    
    if (addedItem) {
      // Add to cart
      this.myProducts.addToCart({
        prodId: addedItem.data.id,
        userId: addedItem.userId,
        amount: 1
      });
      
      // Remove from favorites
      this.allFavorites = this.allFavorites.filter((item: any) => item.data.id !== prodId);
      
      // Update service
      this.updateFavoritesInService();
      
      console.log(`Product ${prodId} added to cart and removed from favorites`);
    }
  }

  private updateFavoritesInService(): void {
    if (this.allFavorites.length === 0) {
      this.myProducts.ClearFavorites();
    } else {
      const favData = this.allFavorites.map((item: any) => ({
        prodId: item.data.id,
        userId: item.userId
      }));
      this.myProducts.UpdateFavProducts(favData);
    }
  }

  trackById(index: number, item: any): any {
    return item?.data?.id ?? index;
  }

  ngOnDestroy(): void {
    // Final update before component is destroyed
    this.updateFavoritesInService();
    
    // Complete the subscription
    this.destroy$.next();
    this.destroy$.complete();
  }
}