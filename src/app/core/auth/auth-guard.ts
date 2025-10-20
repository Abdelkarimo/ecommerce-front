import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth';
import { SocialAuth } from './social-auth';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  
  
  const auth = inject(Auth);
  const social = inject(SocialAuth);
  const router = inject(Router);

  // Get current user (normal + social)
  const currentUser = auth.getCurrentUser();
  const socialUser = social.getCurrentUser();

  const isLoggedIn = !!currentUser || !!socialUser;

  // Not logged in → redirect to login
  if (!isLoggedIn) {
    return router.createUrlTree(['/login']);
  }

  // Role-based guard (optional)
  const requiredRole = route.data?.['role'];
  if (requiredRole) {
    
    let userRole = 'user';
    if (currentUser && currentUser.role) {
      userRole = currentUser.role;
    } else if (socialUser && socialUser.role) {
      userRole = socialUser.role;
    }

    if (userRole !== requiredRole) {
      // Not authorized → redirect to home
      return router.createUrlTree(['/']);
    }
  }

  return true;
};
