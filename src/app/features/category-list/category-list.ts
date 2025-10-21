import { Component } from '@angular/core';
import { Product } from '../../core/models/product.model';
import { ActivatedRoute } from '@angular/router';
import { ProductCard } from '../../shared/components/product-card/product-card';
import { Data } from '../../core/services/data';

@Component({
  selector: 'app-category-list',
  imports: [ProductCard],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {
  products: Product[] = [];
  categoryName: string = '';

  constructor(private productService: Data, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.categoryName = params['category'];

      this.productService.getFilteredCategories(this.categoryName).subscribe({
        next: (res) => {
          this.products = res.products;
        },
        error: (err) => {
          console.error(err);
        },
      });
    });
  }
}
