import { Component, OnInit } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { ActivatedRoute } from '@angular/router';
import { Data } from '../../../core/services/data';
import { Auth } from '../../../core/auth/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-detail',
  imports: [FormsModule],
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [FormsModule, CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  productId!: number;
  product!: Product;
  selectedImage: string | null = null;
  quantity: number = 1;
  isInFavourites: boolean = false;
  newReview = {
    rating: 0,
    comment: '',
    date: '',
    reviewerName: '',
    reviewerEmail: '',
  };
  stars = [1, 2, 3, 4, 5];
  user: any = null;
  hasReviewed = false;

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

        const storedReviews = localStorage.getItem(`reviews-${this.product.id}`);
        let localReviews: any[] = [];

        try {
          const parsed = storedReviews ? JSON.parse(storedReviews) : [];
          localReviews = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          console.error('Error parsing stored reviews:', e);
          localReviews = [];
        }

        this.product.reviews = [
          ...(Array.isArray(this.product.reviews) ? this.product.reviews : []),
          ...localReviews,
        ];

        // determine if current user already reviewed this product
        this.hasReviewed =
          !!this.user &&
          this.product.reviews?.some((r: any) => {
            if (this.user.email && r.reviewerEmail) return r.reviewerEmail === this.user.email;
            if (this.user.displayName && r.reviewerName)
              return r.reviewerName === this.user.displayName;
            return false;
          });

        if (!this.selectedImage) {
          this.selectedImage = this.product.thumbnail || (this.product.images?.[0] ?? null);
        }
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
  submitReview() {
    if (this.hasReviewed) {
      alert('You have already submitted a review for this product.');
      return;
    }
    if (this.newReview.rating === 0 || !this.newReview.comment.trim()) {
      alert('Please add a rating and a comment before submitting.');
      return;
    }

    this.newReview.date = new Date().toISOString();

    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) this.user = JSON.parse(storedUser);

    this.newReview.reviewerName = this.user.name;
    this.newReview.reviewerEmail = this.user.email;

    const storedKey = `reviews-${this.product.id}`;
    const storedReviews = localStorage.getItem(storedKey);
    const localReviews = storedReviews ? JSON.parse(storedReviews) : [];

    localReviews.push({ ...this.newReview });

    localStorage.setItem(storedKey, JSON.stringify(localReviews));
    // ensure product.reviews exists and add the new review
    this.product.reviews = [
      ...(Array.isArray(this.product.reviews) ? this.product.reviews : []),
      { ...this.newReview },
    ];

    this.hasReviewed = true;

    // Reset form
    this.newReview = {
      rating: 0,
      comment: '',
      date: '',
      reviewerName: '',
      reviewerEmail: '',
    };
  }

  setRating(star: number) {
    this.newReview.rating = star;
  }
}
