import { Routes } from '@angular/router';

// 🧩 Layouts
import { AuthLayout } from './Layout/auth-layout/auth-layout';
import { MainLayout } from './Layout/main-layout/main-layout';

// 🔐 Auth Pages
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

// 📄 General Pages
import { About } from './features/about/about/about';
import { Landing } from './features/landing/landing/landing';
import { ProductList } from './features/products/product-list/product-list';
import { ProductDetail } from './features/products/product-detail/product-detail';
import { ProductSearch } from './features/products/product-search/product-search';
import { Cart } from './features/cart/cart/cart';
import { Checkout } from './features/cart/checkout/checkout';
import { FavouriteList } from './features/favourites/favourite-list/favourite-list';
import { CategoryList } from './features/category-list/category-list';
import { OrderConfirmation } from './features/order-confirmation/order-confirmation';

// ⚙️ Admin
import { AdminDashboard } from './features/admin/admin-dashboard/admin-dashboard';
import { ProductCrud } from './features/admin/product-crud/product-crud';

// 🛡️ Guards
import { authGuard } from './core/auth/auth-guard';

// ------------------------------------------------------------
// 🚦 Application Routes
// ------------------------------------------------------------
export const routes: Routes = [
  // 🏠 Main layout for public and protected pages
  {
    path: '',
    component: MainLayout,
    children: [
      // Public routes
      { path: '', component: Landing },
      { path: 'category-list', component: CategoryList },
      { path: 'about', component: About },
      { path: 'products', component: ProductList },
      { path: 'products/:id', component: ProductDetail },
      { path: 'search/:query', component: ProductSearch },

      // Protected routes (require authentication)
      { path: 'cart', component: Cart, canActivate: [authGuard] },
      { path: 'checkout', component: Checkout, canActivate: [authGuard] },
      { path: 'order-confirmation', component: OrderConfirmation, canActivate: [authGuard] },
      { path: 'favourites', component: FavouriteList, canActivate: [authGuard] },

      // Admin routes (require authentication + admin role)
      {
        path: 'admin',
        component: AdminDashboard,
        canActivate: [authGuard],
        data: { role: 'admin' }, // restrict to admin users
        children: [
          {
            path: 'crud',
            component: ProductCrud,
            canActivate: [authGuard],
            data: { role: 'admin' }, // only admin role can access CRUD
          },
        ],
      },
    ],
  },

  // 🔐 Auth layout for login and registration pages
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login },
      { path: 'register', component: Register },
    ],
  },

  // 🌐 Wildcard redirect (fallback)
  { path: '', redirectTo: '', pathMatch: 'full' },
];
