import { Injectable, signal } from '@angular/core';

declare const google: any;
declare const FB: any;

@Injectable({
  providedIn: 'root'
})
export class SocialAuth {
  user = signal<any | null>(null);

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
          const user = this.decodeJwt(token);
          this.user.set(user);
          localStorage.setItem('user', JSON.stringify(user));
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
          this.user.set(userInfo);
          localStorage.setItem('user', JSON.stringify(userInfo));
          callback(userInfo);
        });
      }
    }, { scope: 'public_profile,email' });
  }

  /** =============== LOGOUT =============== **/
  logout() {
    localStorage.removeItem('user');
    this.user.set(null);
  }

  /** =============== CHECK =============== **/
  getCurrentUser() {
    const saved = localStorage.getItem('user');
    if (saved) this.user.set(JSON.parse(saved));
    return this.user();
  }
}
