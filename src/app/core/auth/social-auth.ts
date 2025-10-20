import { Injectable, signal } from '@angular/core';
import { User } from '../interface/User';

declare const google: any;
declare const FB: any;

@Injectable({
  providedIn: 'root'
})
export class SocialAuth {
  // ### user signal to hold current user data
  user = signal<User | null>(null);

  constructor() {
    this.loadGoogleSDK();
    this.loadFacebookSDK();
  }

  /** =============== GOOGLE =============== **/
  private loadGoogleSDK() {
  const existingScript = document.getElementById('google-sdk');
  if (existingScript) return;

  const script = document.createElement('script');
  script.id = 'google-sdk'; // ✅ fixed ID
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  document.body.appendChild(script);
}


  initGoogle(clientId: string, callback: (response: any) => void) {
  const checkGoogle = () => {
    if (typeof google !== 'undefined' && google.accounts?.id) {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: (res: any) => {
          const token = res.credential;
          const decoded = this.decodeJwt(token);

          // ✅ Social user structure
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
          
          // ### set user signal & save to localStorage 
          this.loginSocial(user);
          callback(user);
        }
      });

      // ✅ Render the Google button (optional)
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
      // Wait a bit until the script loads
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

  /** =============== FACEBOOK =============== **/
  private loadFacebookSDK() {
    const existingScript = document.getElementById('facebook-jssdk');
    if (existingScript) return;

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

  loginWithFacebook(callback: (response: any) => void) {
    FB.login((response: any) => {
      if (response.authResponse) {
        FB.api('/me', { fields: 'name,email,picture' }, (userInfo: any) => {

          // ### Social user structure
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

          // ### set user signal & save to localStorage
          this.loginSocial(user);
          callback(userInfo);
        });
      }
    }, { scope: 'public_profile,email' });
  }

  
  /** ✅ Shared social login function */
  private loginSocial(user: User) {
    // ✅ Get all users
    let users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

    // ✅ Check if user exists
    const existingIndex = users.findIndex(u => u.email === user.email);

    if (existingIndex === -1) {
      // First-time login → add new user
      users.push(user);
    } else {
      // Already exists → update info
      users[existingIndex] = { ...users[existingIndex], ...user };
    }

    // ✅ Save to localStorage (main fix)
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(user));

    // ✅ Update signal
    this.user.set(user);
  }

  /** =============== LOGOUT =============== **/
  logout() {
    //localStorage.removeItem('user');
    // ### clear current user
    localStorage.removeItem('currentUser');
    this.user.set(null);
  }

  /** =============== CHECK =============== **/
  getCurrentUser() {
    // ### load from localStorage
  const saved = localStorage.getItem('currentUser');
    if (saved) {
      const parsed = JSON.parse(saved);
      this.user.set(parsed);
      return parsed;
    }
    return null;
  }
  
}
