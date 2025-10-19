import { Component } from '@angular/core';
import { Auth } from '../../../core/auth/auth';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SocialAuth } from '../../../core/auth/social-auth';
@Component({
  selector: 'app-login',
  imports: [FormsModule,RouterLink,RouterLinkActive],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  formData = { email: '', password: '' };
  errorMessage: string = '';
  temp = false
  constructor(public auth: Auth,public social:SocialAuth,private router: Router) {}

  onSubmit() {
    this.errorMessage = '';

    this.temp =  this.auth.login(this.formData);

    if (!this.temp) {
      this.errorMessage = 'Invalid email or password.';
    }
    else {
      this.router.navigate(['/']);}

  }

  loginWithGoogle() {
  this.social.initGoogle(
    '939588541747-juqd6044p24v0ta563e8dm6vto4ecs4k.apps.googleusercontent.com',
    (user) => {
      console.log('Google user:', user);
      this.router.navigate(['/']);
    }
  );
}

  loginWithFacebook() {
    this.social.loginWithFacebook((user) => {
      console.log('Facebook user:', user);
    });
  }

}
