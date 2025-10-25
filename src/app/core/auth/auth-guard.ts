import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from './auth';
import { SocialAuth } from './social-auth';

/**
 * AuthGuard function to protect routes.
 * Checks if a user is logged in (normal or social login)
 * and optionally enforces role-based access.
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean | import("@angular/router").UrlTree => {

  const auth = inject(Auth);
  const social = inject(SocialAuth);
  const router = inject(Router);

  // Get currently logged-in users
  const currentUser = auth.getCurrentUser();
  const socialUser = social.getCurrentUser();

  const isLoggedIn = !!currentUser || !!socialUser;

  // Not logged in → redirect to login page
  if (!isLoggedIn) {
    return router.createUrlTree(['/login']);
  }

  // Role-based access check (optional)
  const requiredRole = route.data?.['role'] as string | undefined;
  if (requiredRole) {
    let userRole: string = 'user'; // default role

    if (currentUser?.role) userRole = currentUser.role;
    else if (socialUser?.role) userRole = socialUser.role;

    if (userRole !== requiredRole) {
      // Not authorized → redirect to home page
      return router.createUrlTree(['/']);
    }
  }

  // Access granted
  return true;
};
