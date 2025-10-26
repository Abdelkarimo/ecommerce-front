# E-Store Angular Application

A **fully-featured e-commerce web application** built with **Angular 20**, allowing users to browse products, manage favourites and carts, place orders, and access an admin dashboard. Supports both **normal authentication** and **social login** (Google & Facebook) with persistent data using `localStorage`.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Authentication & Social Login](#authentication--social-login)
- [Admin Dashboard](#admin-dashboard)
- [Firebase Integration](#firebase-integration)
- [API Integration](#api-integration)
- [Screenshots](#screenshots)
- [Future Improvements](#future-improvements)
- [License](#license)
- [Author](#author)

---

## Project Overview

This Angular project is a **client-side e-commerce platform** that simulates:

- Product catalog browsing
- Category filtering
- Search functionality
- Cart management
- Favourites (wishlist) management
- Checkout and order confirmation
- Admin dashboard for monitoring users and orders
- Social login via Google and Facebook
- Persistent user data through localStorage

It uses a **dummy JSON API** for product data and **Angular Signals** for reactive state management.

---

## Features

### User Features

- **Product Catalog:** Browse all products with search and category filters.
- **Favourites/Wishlist:** Add/remove favourite products.
- **Shopping Cart:** Add/remove products, adjust quantity, and view cart summary.
- **Order Management:** Place orders and view order confirmation details.
- **Social Login:** Sign in with Google or Facebook.
- **Responsive Design:** Fully responsive UI with Bootstrap 5.
- **Local Storage:** User, cart, favourites, and orders stored persistently.

### Admin Features

- **Dashboard Overview:** Total users, total orders, pending orders.
- **Users Table:** View registered users and roles.
- **Orders Table:** View all orders with status (Pending/Delivered).
- **Role-Based Access:** Admin routes protected with **authGuard**.

---

## Technologies

- **Frontend:** Angular 20, TypeScript, RxJS
- **Styling:** Bootstrap 5, FontAwesome
- **Authentication:** Custom + Social (Google & Facebook)
- **State Management:** Angular Signals (Reactive user & social state)
- **Backend:** Dummy JSON API ([https://dummyjson.com/products](https://dummyjson.com/products))
- **Analytics:** Firebase Analytics
- **Tools:** VS Code, Git

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Abdelkarimo/ecommerce-front.git
   cd ecommerce-front
   ```
2. Install Node.js and Angular CLI

   ```bash
   npm install -g @angular/cli
   ```

3. Install Project Dependencies

   ```bash
   npm install
   ```

4. Start Development Server

   ```bash
   ng s -o
   ```

## Usage

1. **Home Page** – Browse featured products and categories.
2. **Product Search** - Use the search bar in the navbar to find items quickly.
3. **Product Details** – Click any product to view images, description, price, and customer reviews.
4. **Add to Cart** - Add items to your cart from detail pages.
5. **Cart** – Add or remove products, update quantities, and view the total before checkout.
6. **Authentication** -

   - Sign up to create a new account.
   - Sign in to access your card, favorites and orders.

7. **Favourites** - Save products you like for later.
8. **Checkout** – Review your cart, enter shipping details, and confirm the order.
9. **Admin** - Add, edit, or delete products directly from the admin panel

## Project structure

Below is a concise, easy-to-scan tree for the repository (top-level files first, then `src/` with important folders/components):

```
ecommerce-front/
├─ public/
│  └─ assets/                # static images and public assets
├─ src/
│  ├─ index.html
│  ├─ main.ts                # bootstrap (uses `appConfig`)
│  ├─ styles.css             # global styles
│  └─ app/
│     ├─ app.ts
│     ├─ app.config.ts       # providers (router, http, firebase, ...)
│     ├─ app.routes.ts
│     ├─ app.html
│     ├─ app.css
│     ├─ core/               # core services, guards, models
│     │  ├─ core-module.ts
│     │  ├─ auth/
│     │  │  ├─ auth.ts
│     │  │  ├─ auth-guard.ts
│     │  │  └─ social-auth.ts
│     │  ├─ interceptors/
│     │  │  └─ token-interceptor.ts
│     │  ├─ interface/
│     │  │  └─ User.ts
│     │  ├─ models/
│     │  │  └─ product.model.ts
│     │  └─ services/
│     │     └─ data.ts       # main Data service used by components
│     ├─ environments/
│     │  └─ environment.ts
│     ├─ features/           # feature modules / pages
│     │  ├─ landing/
│     │  │  └─ landing/
│     │  │     ├─ landing.ts
│     │  │     ├─ landing.html
│     │  │     └─ landing.css
│     │  ├─ products/
│     │  │  ├─ product-list/
│     │  │  │  ├─ product-list.ts
│     │  │  │  ├─ product-list.html
│     │  │  │  └─ product-list.css
│     │  │  └─ product-detail/
│     │  │     ├─ product-detail.ts
│     │  │     ├─ product-detail.html
│     │  │     └─ product-detail.css
│     │  ├─ cart/
│     │  ├─ auth/
│     │  ├─ admin/
│     │  └─ ... (other feature folders: about, favourites, category-list, etc.)
│     ├─ Layout/
│     │  ├─ main-layout/
│     │  └─ auth-layout/
│     └─ shared/
│        ├─ shared-module.ts
│        └─ components/
│           ├─ navbar/
│           ├─ product-card/
│           └─ filter-panel/
└─ package.json

```

Notes

- `src/app/core/services/data.ts` is the main application service (providedIn: 'root').
- `app.config.ts` centralizes providers (router, HTTP, firebase, auth) and should be passed to `bootstrapApplication()` in `main.ts`.
- Feature folders follow a component-per-folder pattern: `component.ts`, `component.html`, `component.css`.

## Authentication & Social Login

## Admin Dashboard

## Firebase Integration

## API Integration

This project uses the [DummyJSON API](https://dummyjson.com/) to simulate backend data for products, carts, and user authentication.

**Base URL**

All requests use the public API:

```bash
    https://dummyjson.com/
```

**Implementation**
HTTP communication is handled through Angular’s `HttpClient` within the `data.service.ts` file located in:

```bash
src/app/core/services/data.ts
```

Example usage:

```bash
 private apiUrl = 'https://dummyjson.com/products';

 getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}?limit=100`);
  }
```

**Common EndPoints**

| Feature                  | Endpoint                        | Method | Description                            |
| ------------------------ | ------------------------------- | ------ | -------------------------------------- |
| Get all products         | `/products`                     | GET    | Retrieve all products                  |
| Get single product       | `/products/{id}`                | GET    | Retrieve details of a specific product |
| Search products          | `/products/search?q={query}`    | GET    | Search by keyword                      |
| Get categories           | `/products/categories`          | GET    | Retrieve all product categories        |
| Get products by category | `/products/category/{category}` | GET    | Retrieve products in a given category  |

Notes

- No backend setup is required.
- All data is fetched directly from DummyJSON.
- You can replace DummyJSON later with a real backend by updating the API URLs in `data.ts`.

## Future Improvements

1. Real API Integration – Replace DummyJSON with a live backend (.NET + SQL).
2. Authentication & Authorization – Implement JWT-based login, signup, and role management (admin/user).
3. Recommendations – Smart suggestions based on user activity.
4. Unit & Integration Testing.
