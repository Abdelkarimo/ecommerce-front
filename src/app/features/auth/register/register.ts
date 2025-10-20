import { Component } from '@angular/core';
import { Auth } from '../../../core/auth/auth';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';



@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.css',
  imports: [FormsModule,RouterLink,RouterLinkActive]
})
export class Register {
  formData = { name: '', email: '', password: '' };
  message = '';
  errorMessage = '';

  constructor(private auth: Auth) {}

  onSubmit() {
    const success = this.auth.register(this.formData);
    if (success) {
      this.message = 'Registration successful! You can now login.';
      this.errorMessage = '';
    } else {
      this.errorMessage = 'Email already exists!';
      this.message = '';
    }
  }
}
