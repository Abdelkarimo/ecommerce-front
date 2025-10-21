import { Component, OnInit } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { ActivatedRoute } from '@angular/router';
import { Data } from '../../../core/services/data';
import { Auth } from '../../../core/auth/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  imports: [FormsModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  productId!: number;
  product!: Product;
  selectedImage: string | null = null;
  quantity: number = 1;
  isInFavourites: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private productService: Data,
    private auth: Auth
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.productId = Number(params.get('id'));
      this.loadProduct();
    });
  }

  loadProduct() {
    this.productService.getProductById(this.productId).subscribe({
      next: (res) => {
        this.product = res;
        this.isInFavourites = this.productService.isInFavourites(this.productId);
      },
      error: (err) => console.error(err),
    });
  }

  addToCart() {
    if (this.productService.addToCart(this.productId, this.quantity)) {
      alert('Product added to cart successfully!');
    } else {
      alert('Please login to add products to cart');
    }
  }

  toggleFavourite() {
    if (this.productService.toggleFavourite(this.productId)) {
      this.isInFavourites = !this.isInFavourites;
      const message = this.isInFavourites ? 'Added to favourites!' : 'Removed from favourites!';
      alert(message);
    } else {
      alert('Please login to manage favourites');
    }
  }

  incrementQuantity() {
    if (this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
