  import { Component } from '@angular/core';
  import { FormsModule } from '@angular/forms';
  import { Router, RouterLink, RouterLinkActive } from '@angular/router';
  import { Auth } from '../../../core/auth/auth';
  import { Data } from '../../../core/services/data';
  import { User } from '../../../core/interface/User';
  import { AfterViewInit } from '@angular/core';
  // 🔹 Firebase imports
  import {
    getAuth,
    signInWithPopup,
    FacebookAuthProvider,
    GoogleAuthProvider,
    fetchSignInMethodsForEmail,
    linkWithCredential,
    OAuthCredential
  } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements AfterViewInit {
  formData = { email: '', password: '' };
  errorMessage = '';
  temp = false;

    constructor(
      private router: Router,
      public auth: Auth,
      private data: Data
    ) {}
    
  ngAfterViewInit() {
    // scroll to the login section once the page loads
    setTimeout(() => {
      const element = document.getElementById('login');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }


    /** 🔐 Normal login */
    onSubmit() {
      this.errorMessage = '';
      this.temp = this.auth.login(this.formData);

      if (!this.temp) {
        this.errorMessage = 'Invalid email or password.';
      } else {
        this.router.navigate(['/']);
      }
    }

    /** 🌐 Google Login */
    async loginWithGoogle() {
      const firebaseAuth = getAuth();
      const provider = new GoogleAuthProvider();

      try {
        const result = await signInWithPopup(firebaseAuth, provider);
        const gUser = result.user;

        const mappedUser: User = {
          id: gUser.uid,
          name: gUser.displayName || 'Unknown User',
          email: gUser.email || '',
          role: 'user',
          source: 'google',
          picture: gUser.photoURL || '',
          cart: [],
          favourites: []
        };

        this.handleSocialUser(mappedUser);

      } catch (error) {
        console.error('Google login error:', error);
        this.errorMessage = 'Google login failed. Please try again.';
      }
    }

    /** 📘 Facebook Login */
    async loginWithFacebook() {
      const firebaseAuth = getAuth();
      const provider = new FacebookAuthProvider();

      try {
        const result = await signInWithPopup(firebaseAuth, provider);
        const fbUser = result.user;

        const mappedUser: User = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Unknown User',
          email: fbUser.email || '',
          role: 'user',
          source: 'facebook',
          picture: fbUser.photoURL || '',
          cart: [],
          favourites: []
        };

        this.handleSocialUser(mappedUser);

      } catch (error: any) {
        console.error('Facebook login error:', error);

        if (error.code === 'auth/account-exists-with-different-credential') {
          const pendingCred = FacebookAuthProvider.credentialFromError(error) as OAuthCredential;
          const email = error.customData?.email;

          if (!email) {
            this.errorMessage = 'Could not retrieve email from Facebook.';
            return;
          }

          const methods = await fetchSignInMethodsForEmail(firebaseAuth, email);
          console.log('Existing sign-in methods:', methods);

          if (methods.includes('google.com')) {
            alert('This email is registered with Google. Please sign in with Google.');

            const googleProvider = new GoogleAuthProvider();
            const googleResult = await signInWithPopup(firebaseAuth, googleProvider);

            if (googleResult.user) {
              await linkWithCredential(googleResult.user, pendingCred);
              const linkedUser: User = {
                id: googleResult.user.uid,
                name: googleResult.user.displayName || 'Unknown User',
                email: googleResult.user.email || '',
                role: 'user',
                source: 'google',
                picture: googleResult.user.photoURL || '',
                cart: [],
                favourites: []
              };
              this.handleSocialUser(linkedUser);
            }
          } else {
            this.errorMessage = 'This email is registered differently. Try another login method.';
          }
        } else if (error.code === 'auth/popup-closed-by-user') {
          console.warn('User closed the Facebook login popup.');
        } else {
          this.errorMessage = 'Facebook login failed. Please try again.';
        }
      }
    }

    /** 🧩 Common method for Google/Facebook users */
    private handleSocialUser(mappedUser: User) {
      // Load users from localStorage
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find(u => u.email === mappedUser.email);

      if (existingUser) {
        // ✅ Existing user → login
        this.data['user'].set(existingUser);
        localStorage.setItem('currentUser', JSON.stringify(existingUser));
        this.auth.isLoggedIn.set(true);
        this.router.navigate(['/']);
      } else {
        // 🚀 New user → save and redirect to register
        users.push(mappedUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(mappedUser));

        // Use Data service to sync
        this.data['user'].set(mappedUser);
        this.auth.user.set(mappedUser);
        this.auth.isLoggedIn.set(true);

        this.router.navigate(['/register']); // You can change this to '/' if you prefer auto-registration
      }
    }
  }
