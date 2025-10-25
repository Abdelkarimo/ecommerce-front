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
   git clone https://github.com/Abdelkarimo/estore-angular.git
   cd estore-angular
