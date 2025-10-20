import { Component } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-detail',
  imports: [],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  productId!: number;
  product!: Product;
  selectedImage: string | null = null;

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.productId = Number(params.get('id'));
      this.loadProduct();
    });
  }

  loadProduct() {
    this.productService.getProductById(this.productId).subscribe({
      next: (res) => (this.product = res),
      error: (err) => console.error(err),
    });
  }
}
