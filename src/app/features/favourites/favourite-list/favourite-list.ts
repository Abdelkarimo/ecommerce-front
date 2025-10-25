/**
 * FavouriteList Component
 * -----------------------
 * - Loads the current user's favourite items (IDs) from the Data service.
 * - Fetches full product details for each favourite item and displays them.
 * - Allows removing items from favourites and moving items to the cart.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth } from '../../../core/auth/auth';
import { Data } from '../../../core/services/data';

@Component({
  selector: 'app-favourite-list',
  imports: [CommonModule],
  templateUrl: './favourite-list.html',
  styleUrl: './favourite-list.css' // kept exactly as in your original file
})
export class FavouriteList implements OnInit, OnDestroy {
  // Raw favourite item info from the data service (contains productId + quantity/meta)
  allFavoriteInfo: any[] = [];

  // Full product details loaded for each favourite item
  allFavorites: any[] = [];

  constructor(private auth: Auth, private dataService: Data) {}

  /**
   * Load favourite items on init:
   * - Get favourite IDs from Data service
   * - Fetch full product details for each favourite and push into allFavorites
   */
  ngOnInit(): void {
    // Get favourites from user data
    this.allFavoriteInfo = this.dataService.getFavouritesItems();

    // Load product details for each favourite item
    this.allFavoriteInfo.forEach((item: any) => {
      this.dataService.getProductById(item.productId).subscribe({
        next: (data: any) => {
          this.allFavorites.push({
            data,
            userId: this.auth.getCurrentUser()?.id,
            productId: item.productId
          });
        },
        error: (error) => console.error('Error loading favourite product:', error)
      });
    });

    // debug log (keeps existing behavior)
    console.log(this.allFavorites);
  }

  /**
   * RemoveFromWishlist
   * - Removes product from favourites via Data service
   * - Removes it from local collection for immediate UI update
   */
  RemoveFromWishlist(prodId: number) {
    // Remove from auth/data service
    this.dataService.removeFromFavourites(prodId);

    // Update local list to reflect removal
    this.allFavorites = this.allFavorites.filter((item: any) => item.data.id !== prodId);
  }

  /**
   * AddToCart
   * - Adds the product to the user's cart (quantity = 1)
   * - Removes the product from favourites afterwards
   */
  AddToCart(prodId: number) {
    // Add to cart using data service
    this.dataService.addToCart(prodId, 1);

    // Remove from favourites after adding to cart
    this.RemoveFromWishlist(prodId);
  }

  /**
   * trackById for ngFor performance
   */
  trackById(index: number, item: any) {
    return item?.data?.id ?? index;
  }

  ngOnDestroy(): void {
    // Favourites data is managed by the auth/data service in real-time.
    console.log('Favourites component destroyed. Favourites data is managed by auth service.');
  }
}
