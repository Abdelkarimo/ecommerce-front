import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Data } from '../../../core/services/data';
import {ProductCard} from '../../../shared/components/product-card/product-card';

@Component({
  selector: 'app-product-search',
  imports: [ProductCard],
  templateUrl: './product-search.html',
  styleUrl: './product-search.css'
})
export class ProductSearch implements OnInit{
constructor(private route: ActivatedRoute,private data: Data) {}
searchTerm: string|null='';
products:any[]=[];
ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    this.searchTerm = params.get('query');
    console.log(this.searchTerm);

    if (this.searchTerm) {
      this.data.searchProducts(this.searchTerm).subscribe({
        next: (data: any) => this.products = data.products,
        error: (error) => console.log(error)
      });
    }
  });
}
}
