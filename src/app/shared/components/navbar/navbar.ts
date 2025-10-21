import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { Admin } from '../../../features/admin/admin';
import { importProvidersFrom } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Input() showLinks: boolean = true;
  currentUser: any = 0;
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
