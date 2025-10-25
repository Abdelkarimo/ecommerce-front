import { Injectable, signal } from '@angular/core';
import { User } from '../interface/User';

declare const google: any;
declare const FB: any;

@Injectable({
  providedIn: 'root'
})
export class SocialAuth {

  // Signal to hold current social user
  user = signal<User | null>(null);

  constructor() {
    this.loadGoogleSDK();
    this.loadFacebookSDK();
  }

  /** ================== GOOGLE ================== */
  private loadGoogleSDK() {
    if (document.getElementById('google-sdk')) return;

    const script = document.createElement('script');
    script.id = 'google-sdk';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }

  initGoogle(clientId: string, callback: (user: User) => void) {
    const checkGoogle = () => {
      if (typeof google !== 'undefined' && google.accounts?.id) {
        google.accounts.id.initialize({
          client_id: clientId,
          callback: (res: any) => {
            const token = res.credential;
            const decoded = this.decodeJwt(token);

            const user: User = {
              id: decoded.sub,
              name: decoded.name,
              email: decoded.email,
              role: 'user',
              source: 'google',
              picture: decoded.picture,
              cart: [],
              favourites: []
            };

            this.loginSocial(user);
            callback(user);
          }
        });

        const button = document.getElementById('g_id_signin');
        if (button) {
          google.accounts.id.renderButton(button, {
            theme: 'outline',
            size: 'large',
            width: 250
          });
        }

        google.accounts.id.prompt();
      } else {
        setTimeout(checkGoogle, 300);
      }
    };
    checkGoogle();
  }

  private decodeJwt(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  }

  /** ================== FACEBOOK ================== */
  private loadFacebookSDK() {
    if (document.getElementById('facebook-jssdk')) return;

    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    document.body.appendChild(script);

    (window as any).fbAsyncInit = function () {
      FB.init({
        appId: 'YOUR_FACEBOOK_APP_ID',
        cookie: true,
        xfbml: true,
        version: 'v19.0'
      });
    };
  }

  loginWithFacebook(callback: (user: User) => void) {
    FB.login((response: any) => {
      if (response.authResponse) {
        FB.api('/me', { fields: 'name,email,picture' }, (userInfo: any) => {

          const user: User = {
            id: userInfo.id,
            name: userInfo.name,
            email: userInfo.email,
            role: 'user',
            source: 'facebook',
            picture: userInfo.picture?.data?.url,
            cart: [],
            favourites: []
          };

          this.loginSocial(user);
          callback(user);
        });
      }
    }, { scope: 'public_profile,email' });
  }

  /** ================== SHARED SOCIAL LOGIN ================== */
  private loginSocial(user: User) {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const existingIndex = users.findIndex(u => u.email === user.email);

    if (existingIndex === -1) {
      users.push(user);
    } else {
      users[existingIndex] = { ...users[existingIndex], ...user };
    }

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.user.set(user);
  }

  /** ================== LOGOUT ================== */
  logout() {
    localStorage.removeItem('currentUser');
    this.user.set(null);
  }

  /** ================== GET CURRENT USER ================== */
  getCurrentUser(): User | null {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      const parsed = JSON.parse(saved);
      this.user.set(parsed);
      return parsed;
    }
    return null;
  }
}
