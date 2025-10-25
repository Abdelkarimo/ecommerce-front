import { Component, Input } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Data } from '../../../core/services/data';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [FormsModule, CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() product!: Product;
  constructor(private router: Router, private productService: Data) { }
  isInFavourites: boolean = false;
  ngOnInit() {
    this.isInFavourites = this.productService.isInFavourites(this.product.id);

  }
  showDetails(id: number) {
    this.router.navigate(['/products', id]);
  }

  toggleFavourite(id: number) {


    if (this.productService.toggleFavourite(id)) {
      this.isInFavourites = !this.isInFavourites;
      const type = this.isInFavourites ? 'success' : 'danger';

      const message = this.isInFavourites ? 'Added to favourites!' : 'Removed from favourites!';
      throw (message);
    } else {
      throw ('Please login to manage favourites');
    }
  }


}
