import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isNavOpen = false;
  banners = [
    { title: 'Get Started on Your favorite shopping' },
    { title: 'New Deals Available Now!' },
    { title: 'Best Offers for You!' },
  ];

  openNav() {
    this.isNavOpen = true;
  }

  closeNav() {
    this.isNavOpen = false;
  }
}
