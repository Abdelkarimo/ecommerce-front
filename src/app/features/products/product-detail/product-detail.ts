import { Component } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { ActivatedRoute } from '@angular/router';
import { Data } from '../../../core/services/data';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [FormsModule, CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  productId!: number;
  product!: Product;
  selectedImage: string | null = null;
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

  constructor(private route: ActivatedRoute, private productService: Data) {}

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
