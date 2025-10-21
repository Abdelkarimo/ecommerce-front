import { Component, Input } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-card',
  imports: [FormsModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() product!: Product;
  constructor(private router: Router) {}

  showDetails(id: number) {
    this.router.navigate(['/products', id]);
  }
}
