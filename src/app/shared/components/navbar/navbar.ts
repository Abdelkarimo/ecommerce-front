import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../core/auth/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink,RouterLinkActive],
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  @Input() showLinks: boolean = true;

  currentUser : any;
  constructor(public auth: Auth) {}
  logout() {
    this.auth.logout();
  }

  ngOnInit(): void {
      this.currentUser = this.auth.getCurrentUser();
  }


}
