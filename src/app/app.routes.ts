import { ProductList } from './features/products/product-list/product-list';
import { Landing } from './features/landing/landing/landing';
import { About } from './features/about/about/about';
import { FavouriteList } from './features/favourites/favourite-list/favourite-list';
import { CategoryList } from './features/category-list/category-list';
import { ProductDetail } from './features/products/product-detail/product-detail';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'home', component: Landing },
  { path: 'products', component: ProductList },
  { path: 'about', component: About },
  { path: 'favourite-list', component: FavouriteList },
  { path: 'category-list', component: CategoryList },
  { path: 'product/:id', component: ProductDetail },
];
