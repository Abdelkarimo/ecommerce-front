import { Component, OnInit, Output, EventEmitter } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-filter-panel',
  imports: [FormsModule],
  templateUrl: './filter-panel.html',
  styleUrl: './filter-panel.css',
})
export class FilterPanel implements OnInit {
  @Output() productsChanged = new EventEmitter<Product[]>();

  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: string[] = [];
  selectedCategories: string[] = [];
  sortOption: string = '';

  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data.products;
      this.filteredProducts = data.products;

      this.categories = [...new Set(this.products.map((p) => p.category))];
      this.applyFilters();
      // this.emitFilteredProducts();
    });
  }

  private emitFilteredProducts() {
    this.productsChanged.emit(this.filteredProducts);
  }

  toggleCategory(category: string) {
    if (this.selectedCategories.includes(category)) {
      this.selectedCategories = this.selectedCategories.filter((c) => c !== category);
    } else {
      this.selectedCategories.push(category);
    }
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(
      (p) => this.selectedCategories.length === 0 || this.selectedCategories.includes(p.category)
    );
    console.log(this.filteredProducts);
    this.applySorting();
    this.emitFilteredProducts(); //emit whenever filters change
  }

  applySorting() {
    if (this.sortOption === 'priceLowHigh') {
      this.filteredProducts.sort((a, b) => a.price - b.price);
    } else if (this.sortOption === 'priceHighLow') {
      this.filteredProducts.sort((a, b) => b.price - a.price);
    } else if (this.sortOption === 'rating') {
      this.filteredProducts.sort((a, b) => b.rating - a.rating);
    }
  }

  resetFilters() {
    this.selectedCategories = [];
    this.sortOption = '';
    this.filteredProducts = [...this.products];
    this.emitFilteredProducts(); //  also emit on reset
  }
}
