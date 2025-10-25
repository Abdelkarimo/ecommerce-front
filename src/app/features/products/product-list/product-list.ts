import { Component } from '@angular/core';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { Product } from '../../../core/models/product.model';
import { FilterPanel } from '../../../shared/components/filter-panel/filter-panel';
import { Data } from '../../../core/services/data';

@Component({
  selector: 'app-product-list',
  imports: [ProductCard, FilterPanel],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  // =======================
  // ✅ Variables
  // =======================

  // Holds all products fetched from the API
  products: Product[] = [];

  // Holds products filtered by category, search, or other criteria
  filteredProducts: Product[] = [];

  // Used to control loading indicators
  loading = true;

  // =======================
  // ✅ Constructor
  // =======================
  constructor(private productService: Data) {}

  // =======================
  // ✅ Lifecycle Hook: ngOnInit
  // Fetches product data when component initializes
  // =======================
  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (res) => {
        // Store products from API response
        this.products = res.products;

        // Stop showing loading spinner
        this.loading = false;
      },
      error: (err) => {
        // Handle any API errors gracefully
        console.error(err);

        // Stop loading even if an error occurs
        this.loading = false;
      },
    });
  }

  // =======================
  // ✅ Event Handler
  // Called when filtered products are emitted by the FilterPanel component
  // =======================
  onProductsChanged(products: Product[]): void {
    this.filteredProducts = products;
  }
}
