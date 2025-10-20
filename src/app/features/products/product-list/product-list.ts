import { Component } from '@angular/core';
import { ProductCard } from '../../../shared/components/product-card/product-card';
import { Product } from '../../../core/models/product.model';
import { ProductService } from '../../../core/services/product.service';
import { FilterPanel } from '../../../shared/components/filter-panel/filter-panel';

@Component({
  selector: 'app-product-list',
  imports: [ProductCard, FilterPanel],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  loading = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (res) => {
        this.products = res.products;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  onProductsChanged(products: Product[]) {
    this.filteredProducts = products;
  }
}
