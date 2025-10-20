import { Component } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
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
