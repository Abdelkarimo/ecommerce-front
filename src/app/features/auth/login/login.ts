import { Component, AfterViewInit } from '@angular/core';
import { Auth } from '../../../core/auth/auth';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  getAuth,
  signInWithPopup,
  FacebookAuthProvider,
  GoogleAuthProvider,
  fetchSignInMethodsForEmail,
  linkWithCredential,
  OAuthCredential,
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

  constructor(public auth: Auth, private router: Router) {}

  ngAfterViewInit() {
    // scroll to the login section once the page loads
    setTimeout(() => {
      const element = document.getElementById('login');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  onSubmit() {
    this.errorMessage = '';
    this.temp = this.auth.login(this.formData);
    if (!this.temp) this.errorMessage = 'Invalid email or password.';
    else this.router.navigate(['/']);
  }

  async loginWithGoogle() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      console.log('✅ Google user:', result.user);
      localStorage.setItem('user', JSON.stringify(result.user));
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Google login error:', error);
      this.errorMessage = 'Google login failed. Please try again.';
    }
  }

  async loginWithFacebook() {
    const auth = getAuth();
    const provider = new FacebookAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      console.log('✅ Facebook user:', result.user);
      localStorage.setItem('user', JSON.stringify(result.user));
      this.router.navigate(['/']);
    } catch (error: any) {
      console.error('❌ Facebook login error:', error);

      // 🧩 معالجة الحالة الخاصة بالحساب الموجود ببيانات مختلفة
      if (error.code === 'auth/account-exists-with-different-credential') {
        const pendingCred = FacebookAuthProvider.credentialFromError(error) as OAuthCredential;
        const email = error.customData?.email;

        if (!email) {
          this.errorMessage = 'حدث خطأ أثناء جلب البريد الإلكتروني من فيسبوك.';
          return;
        }

        // 🔍 نجيب طريقة تسجيل الدخول الأصلية لهذا البريد
        const methods = await fetchSignInMethodsForEmail(auth, email);
        console.log('🔹 Existing sign-in methods:', methods);

        if (methods.includes('google.com')) {
          alert(
            'هذا البريد مسجل بالفعل باستخدام Google. الرجاء تسجيل الدخول بـ Google لتوحيد الحساب.'
          );

          const googleProvider = new GoogleAuthProvider();
          const googleResult = await signInWithPopup(auth, googleProvider);

          if (googleResult.user) {
            // 🔗 ربط حساب فيسبوك بالحساب الحالي في Firebase
            await linkWithCredential(googleResult.user, pendingCred);
            console.log('✅ تم ربط حساب Facebook بحساب Google بنجاح!');
            localStorage.setItem('user', JSON.stringify(googleResult.user));
            this.router.navigate(['/']);
          }
        } else {
          this.errorMessage = 'هذا البريد مسجل بطريقة مختلفة. برجاء تسجيل الدخول بنفس الطريقة.';
        }
      } else if (error.code === 'auth/popup-closed-by-user') {
        console.warn('🟡 المستخدم أغلق نافذة تسجيل الدخول قبل الإكمال.');
      } else {
        this.errorMessage = 'حدث خطأ أثناء تسجيل الدخول بـ Facebook. حاول مرة أخرى.';
      }
    }
  }
}
