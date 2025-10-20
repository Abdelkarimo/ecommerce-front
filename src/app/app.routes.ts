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
import { CartComponent } from './features/cart/cart/cart';
import { CheckoutComponent } from './features/cart/checkout/checkout';
import { FavouriteComponent } from './features/favourites/favourite';

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
      { path: 'cart', component: CartComponent, canActivate: [authGuard]  },
      { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard]  },
      { path: 'favourites', component: FavouriteComponent, canActivate: [authGuard]  },
      {path:"favorites",redirectTo:"favourites"},
      {
        path: 'admin',
        component: AdminDashboard,
        // ### restrict to admin users
        canActivate: [authGuard],
        // ### only admin role can access
        data: { role: 'admin' },
        
        // ### only admin role can access
        children: [
          // ### admin child routes
          { path: 'crud', component: ProductCrud, canActivate: [authGuard], data: { role: 'admin' }},
          // ### admin child routes
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
  { path: '', redirectTo: '', pathMatch: 'full' }
];