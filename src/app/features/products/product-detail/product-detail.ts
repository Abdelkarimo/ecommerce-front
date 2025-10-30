import { Component, OnInit } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { ActivatedRoute } from '@angular/router';
import { Data } from '../../../core/services/data';
import { Auth } from '../../../core/auth/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  imports: [FormsModule, CommonModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail implements OnInit {
  // =======================
  // ✅ Variables
  // =======================
  productId!: number; // ID of the current product
  product!: Product; // Current product details
  selectedImage: string | null = null; // Image selected for display
  quantity: number = 1; // Quantity selected for cart
  isInFavourites: boolean = false; // Flag for favourite state
  hasReviewed = false; // Whether current user has submitted a review

  // New review form model
  newReview = {
    rating: 0,
    comment: '',
    date: '',
    reviewerName: '',
    reviewerEmail: '',
  };

  stars = [1, 2, 3, 4, 5]; // For star rating UI
  user: any = null; // Current logged-in user

  // =======================
  // ✅ Constructor
  // =======================
  constructor(
    private route: ActivatedRoute,
    private productService: Data,
    private auth: Auth
  ) {}

  // =======================
  // ✅ Lifecycle Hook: ngOnInit
  // Retrieves product ID from route and loads product details
  // =======================
  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.productId = Number(params.get('id'));
      this.loadProduct();
    });
  }

  // =======================
  // ✅ Load Product
  // Fetches product details and reviews from service and localStorage
  // =======================
  loadProduct() {
    this.productService.getProductById(this.productId).subscribe({
      next: (res) => {
        this.product = res;

        // Check if product is in favourites
        this.isInFavourites = this.productService.isInFavourites(this.productId);

        // Load locally stored reviews
        const storedReviews = localStorage.getItem(`reviews-${this.product.id}`);
        let localReviews: any[] = [];
        try {
          const parsed = storedReviews ? JSON.parse(storedReviews) : [];
          localReviews = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          console.error('Error parsing stored reviews:', e);
          localReviews = [];
        }

        // Merge API reviews with local reviews
        this.product.reviews = [
          ...(Array.isArray(this.product.reviews) ? this.product.reviews : []),
          ...localReviews,
        ];

        // Determine if current user has already reviewed this product
        this.hasReviewed =
          !!this.user &&
          this.product.reviews?.some((r: any) => {
            if (this.user.email && r.reviewerEmail) return r.reviewerEmail === this.user.email;
            if (this.user.displayName && r.reviewerName)
              return r.reviewerName === this.user.displayName;
            return false;
          });

        // Set initial selected image
        if (!this.selectedImage) {
          this.selectedImage = this.product.thumbnail || (this.product.images?.[0] ?? null);
        }
      },
      error: (err) => console.error(err),
    });
  }

  // =======================
  // ✅ Add Product to Cart
  // Uses productService, requires user to be logged in
  // =======================
  addToCart() {
    if (this.productService.addToCart(this.productId, this.quantity)) {
      //throw 'Product added to cart successfully!';
    } else {
      throw 'Please login to add products to cart';
    }
  }

  // =======================
  // ✅ Toggle Favourite
  // Adds/removes product from favourites
  // =======================
  toggleFavourite() {
    if (this.productService.toggleFavourite(this.productId)) {
      this.isInFavourites = !this.isInFavourites;
      const message = this.isInFavourites ? 'Added to favourites!' : 'Removed from favourites!';
      throw message;
    } else {
      throw 'Please login to manage favourites';
    }
  }

  // =======================
  // ✅ Quantity Controls
  // =======================
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

  // =======================
  // ✅ Submit Review
  // Adds a new review to localStorage and product object
  // =======================
  submitReview() {
    // Prevent multiple reviews from same user
    if (this.hasReviewed) {
      throw 'You have already submitted a review for this product.';
      return;
    }

    // Ensure rating and comment are provided
    if (this.newReview.rating === 0 || !this.newReview.comment.trim()) {
      throw 'Please add a rating and a comment before submitting.';
      return;
    }

    this.newReview.date = new Date().toISOString();

    // Load current user
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) this.user = JSON.parse(storedUser);

    this.newReview.reviewerName = this.user.name;
    this.newReview.reviewerEmail = this.user.email;

    // Save review to localStorage
    const storedKey = `reviews-${this.product.id}`;
    const storedReviews = localStorage.getItem(storedKey);
    const localReviews = storedReviews ? JSON.parse(storedReviews) : [];
    localReviews.push({ ...this.newReview });
    localStorage.setItem(storedKey, JSON.stringify(localReviews));

    // Add review to product object
    this.product.reviews = [
      ...(Array.isArray(this.product.reviews) ? this.product.reviews : []),
      { ...this.newReview },
    ];

    this.hasReviewed = true;

    // Reset review form
    this.newReview = {
      rating: 0,
      comment: '',
      date: '',
      reviewerName: '',
      reviewerEmail: '',
    };
  }

  // =======================
  // ✅ Set Star Rating
  // =======================
  setRating(star: number) {
    this.newReview.rating = star;
  }
}
