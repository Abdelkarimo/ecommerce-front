import { Routes } from '@angular/router';
import { CartComponent } from './features/cart/cart/cart';
import { Landing } from './features/landing/landing/landing';
import { FavouriteComponent } from './features/favourites/favourite';
import { CheckoutComponent } from './features/cart/checkout/checkout';
import { OrderConfirmation } from './features/order-confirmation/order-confirmation';

export const routes: Routes = [
    { path: '', redirectTo: 'landing', pathMatch: 'full' },
    { path: 'landing', component: Landing, title: 'Landing Page' },
    { path: 'cart', component: CartComponent, title: 'Cart' },
        { path: 'favorites', component: FavouriteComponent, title: 'Favorites' },
        // compatibility: some templates use 'favourites' (british spelling)
        { path: 'favourites', redirectTo: 'favorites' },
    { path: 'checkout', component: CheckoutComponent, title: 'Checkout' },
    { path: 'order-confirmation', component: OrderConfirmation, title: 'Order Confirmation' },
    // fallback
    { path: '**', redirectTo: 'landing' }
];

