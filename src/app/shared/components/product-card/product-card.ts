import { Component, Input } from '@angular/core';
import { Product } from '../../../core/models/product.model';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [TitleCasePipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() product!: Product;
  constructor(private router: Router) {}

  showDetails(id: number) {
    this.router.navigate(['/product', id]);
  }
}
