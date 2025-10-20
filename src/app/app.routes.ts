import { Routes } from '@angular/router';
import { Cart } from './features/cart/cart/cart';
import { Landing } from './features/landing/landing/landing';
import { Favourite } from './features/favourites/favourite';
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
      { path: 'cart', component: Cart, canActivate: [authGuard]  },
      { path: 'checkout', component: Checkout, canActivate: [authGuard]  },
      { path: 'favourites', component: FavouriteList, canActivate: [authGuard]  },
      {
        path: 'admin',
        component: AdminDashboard,
        // ### restrict to admin users
        canActivate: [authGuard],
        // ### only admin role can access
        data: { role: 'admin' },
        children: [
          // ### admin child routes
          { path: 'crud', component: ProductCrud, canActivate: [authGuard], data: { role: 'admin' }}
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
