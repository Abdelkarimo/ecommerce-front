export interface User {
  id: string; 
  name: string;
  email: string;
  password?: string; 
  role: string;       // 'user' or 'admin'
  source?: 'normal' | 'google' | 'facebook';
  picture?: string;
  cart: any[],
  favourites: any[] 
}
