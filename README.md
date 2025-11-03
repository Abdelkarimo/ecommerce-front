# 🛍️ E-Store Angular Application

A _fully-featured e-commerce web application_ built with _Angular 20_, allowing users to browse products 🛒, manage favourites ❤️ and carts 🧺, place orders 📦, and access an admin dashboard 🧑‍💼. Supports both **normal authentication** 🔐 and _social login_ 🌐 (Google & Facebook) with persistent data using 💾 localStorage.

---

## 🧭 Table of Contents

- [📖 Project Overview](#-project-overview)
- [✨ Features](#-features)
- [🧰 Technologies](#-technologies)
- [⚙️ Installation](#️-installation)
- [🚀 Usage](#-usage)
- [📁 Project Structure](#-project-structure)
- [🔐 Authentication](#-authentication)
- [🌐 Social Login](#-social-login)
- [🧑‍💼 Admin Dashboard](#-admin-dashboard)
- [🔥 Firebase Integration](#-firebase-integration)
- [🔗 API Integration](#-api-integration)
- [🪄 Future Improvements](#-future-improvements)
- [🖼️ Demo](#-demo)

---

## 📖 Project Overview

This Angular project is a _client-side e-commerce platform_ that simulates:

- 🛍️ Product catalog browsing
- 🧩 Category filtering
- 🔍 Search functionality
- 🛒 Cart management
- ❤️ Favourites (wishlist) management
- 💳 Checkout and order confirmation
- 🧑‍💼 Admin dashboard for monitoring users and orders
- 🌐 Social login via Google and Facebook
- 💾 Persistent user data through localStorage

It uses a _dummy JSON API_ 🧠 for product data and _Angular Signals_ ⚡ for reactive state management.

---

## ✨ Features

### 👤 User Features

- _Product Catalog:_ Browse all products with search and category filters.
- _Favourites/Wishlist:_ Add/remove favourite products.
- _Shopping Cart:_ Add/remove products, adjust quantity, and view cart summary.
- _Order Management:_ Place orders and view order confirmation details.
- _Social Login:_ Sign in with Google or Facebook.
- _Responsive Design:_ Fully responsive UI with Bootstrap 5.
- _Local Storage:_ User, cart, favourites, and orders stored persistently.

### 🧑‍💼 Admin Features

- _Dashboard Overview:_ Total users, total orders, pending orders.
- _Users Table:_ View registered users and roles.
- _Orders Table:_ View all orders with status (Pending/Delivered).
- _Role-Based Access:_ Admin routes protected with _authGuard_.

---

## 🧰 Technologies

- _Frontend:_ Angular 20, TypeScript, RxJS
- _Styling:_ Bootstrap 5, FontAwesome
- _Authentication:_ Custom + Social (Google & Facebook)
- _State Management:_ Angular Signals (Reactive user & social state)
- _Backend:_ Dummy JSON API ([https://dummyjson.com/products](https://dummyjson.com/products))
- _Analytics:_ Firebase Analytics
- _Tools:_ VS Code, Git

---

## ⚙️ Installation

1. 📥 Clone the repository:
   ```bash
   git clone https://github.com/Abdelkarimo/ecommerce-front.git
   cd ecommerce-front
   ```
2. 💻 Install Node.js and Angular CLI

   ```bash
   npm install -g @angular/cli
   ```

3. 📦 Install Project Dependencies

   ```bash
   npm install
   ```

4. 🚀 Start Development Server

   ```bash
   ng s -o
   ```

---

# 🚀 Usage

## 🏠 Home Page

Browse featured products and categories.

## 🔎 Product Search

Use the search bar in the navbar to find items quickly.

## 🛍️ Product Details

Click any product to view images, description, price, and customer reviews.

## 🧺 Add to Cart

Add items to your cart from detail pages.

## 🧾 Cart

Add or remove products, update quantities, and view the total before checkout.

## 🔐 Authentication

- Sign up ✍️ to create a new account.
- Sign in 🔑 to access your cart, favorites, and orders.

## ❤️ Favourites

Save products you like for later.

## 💳 Checkout

Review your cart, enter shipping details, and confirm the order.

## 🧑‍💼 Admin

Add, edit, or delete products directly from the admin panel.

# 📁 Project Structure

```
ecommerce-front/
├─ public/
│  └─ assets/                # static images and public assets
├─ src/
│  ├─ index.html
│  ├─ main.ts                # bootstrap (uses appConfig)
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

Notes 📝

- `src/app/core/services/data.ts` is the main application service (providedIn: 'root').
- app.config.ts centralizes providers (router, HTTP, firebase, auth) and should be passed to `bootstrapApplication()` in `main.ts`.
- Feature folders follow a component-per-folder pattern: `component.ts`, `component.html`, `component.css`.

---

# 🔐 Authentication

- Register and log in users using local storage as mock persistence.
- Supports role-based access (Admin and User).
- Maintains login state using Angular signals.
- Includes logout and session validation functionality.
- Automatically assigns admin privileges to predefined admin accounts.

# 🌐 Social Login

## 🔵 Google Login

- Uses Google Identity Services for authentication.
- Retrieves and decodes user information (name, email, profile picture).
- Automatically registers or updates the user in the local data store.

## 🔷 Facebook Login

- Integrates the Facebook SDK for secure authentication.
- Requests access to basic profile and email information.
- Saves or updates user data locally for seamless future access.

## 🔁 Shared Features

- Unified logic for saving, updating, and managing social user sessions.
- Automatic session restoration on reload.
- Secure logout for both Google and Facebook sessions.

# 🧑‍💼 Admin Dashboard

A standalone component displaying mock data and key statistics for administrators.

- Displays registered users and order lists.
- Shows total users, total orders, and pending orders.
- Provides a quick overview of platform activity.
- Demonstrates how role-based access can control admin views.

---

# 🔥 Firebase Integration

This project includes optional Firebase setup instructions for integrating a real backend.

- Authentication
- Firestore Database
- Cloud Storage
- Hosting for deployment

---

# 🔗 API Integration

This project uses the [DummyJSON API](https://dummyjson.com/) 🌍 to simulate backend data for products, carts, and user authentication.

Base URL 🌐

All requests use the public API:

```bash
https://dummyjson.com/
```

Implementation ⚙  
HTTP communication is handled through Angular’s HttpClient within the data.service.ts file located in:

```bash
src/app/core/services/data.ts
```

Example usage: 💡

```bash
private apiUrl = 'https://dummyjson.com/products';


getProducts(): Observable<any> {
return this.http.get(${this.apiUrl}?limit=100);
}
```

Common EndPoints 🔗

| Feature                  | Endpoint                      | Method | Description                            |
| ------------------------ | ----------------------------- | ------ | -------------------------------------- |
| Get all products         | /products                     | GET    | Retrieve all products                  |
| Get single product       | /products/{id}                | GET    | Retrieve details of a specific product |
| Search products          | /products/search?q={query}    | GET    | Search by keyword                      |
| Get categories           | /products/categories          | GET    | Retrieve all product categories        |
| Get products by category | /products/category/{category} | GET    | Retrieve products in a given category  |

### 🗒️ Notes:

- No backend setup is required.
- All data is fetched directly from DummyJSON.
- You can replace DummyJSON later with a real backend by updating the API URLs in `data.ts`.

## 🪄 Future Improvements

1. Real API Integration – Replace DummyJSON with a live backend (.NET + SQL). ⚙
2. Authentication & Authorization – Implement JWT-based login, signup, and role management (admin/user). 🔑
3. Recommendations – Smart suggestions based on user activity. 🧠
4. Unit & Integration Testing. 🧪

## 🖼 Demo

### 🔗 Live Demo

👉 [View Live Application](https://ecommerce-front-eight-theta.vercel.app/)

### 🖼️ Demo GIF

<p align="center">
  <img src="./public/assets/videos/Project%20Demo.gif" alt="Loadify Demo" width="800"/>
</p>
