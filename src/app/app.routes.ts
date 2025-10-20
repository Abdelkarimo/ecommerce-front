import { CategoryList } from './features/category-list/category-list';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';

// Layouts
import { AuthLayout } from './Layout/auth-layout/auth-layout';
import { MainLayout } from './Layout/main-layout/main-layout';

// Auth
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

// Pages
import { About } from './features/about/about/about';
import { Landing } from './features/landing/landing/landing';
import { ProductList } from './features/products/product-list/product-list';
import { ProductDetail } from './features/products/product-detail/product-detail';
import { Cart } from './features/cart/cart/cart';
import { Checkout } from './features/cart/checkout/checkout';
import { FavouriteList } from './features/favourites/favourite-list/favourite-list';

// Admin
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { ProductCrud } from './features/admin/product-crud/product-crud';
import { authGuard } from './core/auth/auth-guard';

export const routes: Routes = [
  // 🏠 Public pages (Main Layout)
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Landing },
      { path: 'about', component: About },
      { path: 'products', component: ProductList },
      { path: 'products/:id', component: ProductDetail },
      // ### protected routes
      { path: 'cart', component: Cart, canActivate: [authGuard] },
      { path: 'checkout', component: Checkout, canActivate: [authGuard] },
      { path: 'favourites', component: FavouriteList, canActivate: [authGuard] },
      {
        path: 'admin',
        component: AdminDashboard,
        // ### restrict to admin users
        canActivate: [authGuard],
        // ### only admin role can access
        data: { role: 'admin' },
        children: [
          // ### admin child routes
          {
            path: 'crud',
            component: ProductCrud,
            canActivate: [authGuard],
            data: { role: 'admin' },
          },
        ],
      },
    ],
  },

  // 🔐 Auth pages (Auth Layout)
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login },
      { path: 'register', component: Register },
    ],
  },

  // 🌐 Wildcard redirect
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
