/**
 * ProductSearch Component
 * -----------------------
 * - Handles searching for products based on the search term in the URL.
 * - Fetches matching products using the Data service.
 * - Displays search results using ProductCard component.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Data } from '../../../core/services/data';
import { ProductCard } from '../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-product-search',
  imports: [ProductCard],
  templateUrl: './product-search.html',
  styleUrl: './product-search.css'
})
export class ProductSearch implements OnInit {
  // The search query from the URL
  searchTerm: string | null = '';

  // Array to hold products matching the search term
  products: any[] = [];

  constructor(
    private route: ActivatedRoute, // Access URL parameters
    private data: Data             // Service for fetching product data
  ) {}

  ngOnInit(): void {
    // Subscribe to route parameters to get the search term
    this.route.paramMap.subscribe(params => {
      this.searchTerm = params.get('query');
      console.log(this.searchTerm);

      if (this.searchTerm) {
        // Fetch products matching the search term
        this.data.searchProducts(this.searchTerm).subscribe({
          next: (data: any) => this.products = data.products,
          error: (error) => console.log(error) // Log any errors
        });
      }
    });
  }
}
