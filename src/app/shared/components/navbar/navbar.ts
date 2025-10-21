import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar implements OnInit {
  @Input() showLinks: boolean = true;
  user: any = null;
  isNavOpen = false;
  banners = [
    { title: 'Get Started on Your favorite shopping' },
    { title: 'New Deals Available Now!' },
    { title: 'Best Offers for You!' },
  ];

  ngOnInit() {
    this.loadUser();

    // Optional: Automatically update the UI when user changes (for SPAs)
    window.addEventListener('storage', () => this.loadUser());
  }

  private loadUser() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    } else {
      this.user = null;
    }
  }

  logOut() {
    localStorage.removeItem('currentUser');
    this.user = null;
  }

  openNav() {
    this.isNavOpen = true;
  }

  closeNav() {
    this.isNavOpen = false;
  }
}
