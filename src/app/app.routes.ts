import { Routes } from '@angular/router';
import { Product } from './features/products/product';
import { ProductList } from './features/products/product-list/product-list';

export const routes: Routes = [{ path: 'products', component: ProductList }];
