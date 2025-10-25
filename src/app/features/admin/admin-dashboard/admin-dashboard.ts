/**
 * AdminDashboard Component
 * -------------------------
 * Displays mock admin data such as users and orders.
 * Includes statistics like total users, total orders, and pending orders.
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {
  users: any[] = [];
  orders: any[] = [];

  ngOnInit(): void {
    // Initialize with mock user data
    this.users = [
      { id: 1, name: 'Abdelkarim Refaey', email: 'abdelkarim@gmail.com', role: 'Admin' },
      { id: 2, name: 'Omar Khaled', email: 'omar.k@example.com', role: 'Customer' },
      { id: 3, name: 'Sara Ahmed', email: 'sara.a@example.com', role: 'Customer' }
    ];

    // Initialize with mock order data
    this.orders = [
      { id: 101, user: 'Omar Khaled', total: 250, status: 'Pending', date: '2025-10-19' },
      { id: 102, user: 'Sara Ahmed', total: 460, status: 'Delivered', date: '2025-10-17' }
    ];
  }

  // Total number of users
  get totalUsers() {
    return this.users.length;
  }

  // Total number of orders
  get totalOrders() {
    return this.orders.length;
  }

  // Number of orders with 'Pending' status
  get pendingOrders() {
    return this.orders.filter(order => order.status === 'Pending').length;
  }
}
