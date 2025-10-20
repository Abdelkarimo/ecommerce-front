import { Routes } from '@angular/router';
import { Cart } from './features/cart/cart/cart';
import { Landing } from './features/landing/landing/landing';
import { Favourite } from './features/favourites/favourite';
import { Checkout } from './features/cart/checkout/checkout';
export const routes: Routes = [
    {path:'',redirectTo:"landing",pathMatch:'full'},
    {path:'landing',component:Landing,title:'Landing Page'},
    {path:'cart', component: Cart, title:'cart'},
    {path:'favorites',component:Favourite,title:'favorite'},
    {path:'checkout',component:Checkout,title:'checkout'}
  
];
