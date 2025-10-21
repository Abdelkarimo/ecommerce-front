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
  user: any = null;
  banners = [
    { title: 'Get Started on Your favorite shopping' },
    { title: 'New Deals Available Now!' },
    { title: 'Best Offers for You!' },
  ];

  ngOnInit() {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      console.log(this.user);
    }
  }

  logOut() {
    localStorage.removeItem('user');
    this.user = null;
  }
  openNav() {
    this.isNavOpen = true;
  }

  closeNav() {
    this.isNavOpen = false;
  }
}
