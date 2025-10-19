import { Routes } from '@angular/router';

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
      { path: 'cart', component: Cart },
      { path: 'checkout', component: Checkout },
      { path: 'favourites', component: FavouriteList },
      {
        path: 'admin',
        component: AdminDashboard,
        children: [
          { path: 'crud', component: ProductCrud }
        ]
      }
    ]
  },

  // 🔐 Auth pages (Auth Layout)
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login },
      { path: 'register', component: Register }
    ]
  },

  // 🌐 Wildcard redirect
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
