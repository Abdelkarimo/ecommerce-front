import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Data } from '../../../core/services/data';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements OnInit {
  @Input() showLinks: boolean = true; // Flag to control display of navigation links
  user: any = null; // Stores the currently logged-in user
  isNavOpen = false; // Flag to track if the mobile navigation is open
  searchTerm = ''; // Search input value

  favouritesCount = 0; // Number of favourite items
  cartCount = 0; // Number of items in the cart

  constructor(private dataService: Data, private router: Router) {}

  /**
   * Navigate to the search page if the search term is not empty
   */
  SearchItems() {
    if (this.searchTerm !== '') {
      this.router.navigate(['/search', this.searchTerm]);
    }
  }

  /**
   * Lifecycle hook: Called once the component is initialized
   * Loads user data and subscribes to cart/favourites changes
   */
  ngOnInit() {
    this.loadUser();

    // Initialize counts
    this.cartCount = this.dataService.getCartItemsCount();
    this.favouritesCount = this.dataService.getFavouritesCount();

    // Subscribe to favourites changes
    this.dataService.favouritesChanged.subscribe(() => {
      this.favouritesCount = this.dataService.getFavouritesCount();
    });

    // Subscribe to cart changes
    this.dataService.cartChanged.subscribe(() => {
      this.cartCount = this.dataService.getCartItemsCount();
    });

    // Optional: Listen to storage changes to update user automatically (SPA)
    window.addEventListener('storage', () => this.loadUser());
  }

  /**
   * Load the current user from localStorage
   * Sets `user` to null if no user is found
   */
  private loadUser() {
    const storedUser = localStorage.getItem('currentUser');
    this.user = storedUser ? JSON.parse(storedUser) : null;
  }

  /**
   * Log out the current user
   * Removes user data from localStorage and resets `user`
   */
  logOut() {
    localStorage.removeItem('currentUser');
    this.user = null;
  }

  /**
   * Open the mobile navigation menu
   */
  openNav() {
    this.isNavOpen = true;
  }

  /**
   * Close the mobile navigation menu
   */
  closeNav() {
    this.isNavOpen = false;
  }
}
