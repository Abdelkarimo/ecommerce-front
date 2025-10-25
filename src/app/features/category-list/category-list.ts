/**
 * CategoryList Component
 * -----------------------
 * Displays a list of products filtered by a specific category.
 * The category is retrieved from the route query parameters.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { Data } from '../../core/services/data';
import { ProductCard } from '../../shared/components/product-card/product-card';

@Component({
  selector: 'app-category-list',
  imports: [ProductCard],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css'
})
export class CategoryList implements OnInit {
  products: Product[] = [];
  categoryName: string = '';

  constructor(
    private productService: Data,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get category from query parameters and load corresponding products
    this.route.queryParams.subscribe(params => {
      this.categoryName = params['category'];

      this.productService.getFilteredCategories(this.categoryName).subscribe({
        next: (res) => {
          this.products = res.products;
        },
        error: (err) => console.error('Error loading category products:', err)
      });
    });
  }
}
