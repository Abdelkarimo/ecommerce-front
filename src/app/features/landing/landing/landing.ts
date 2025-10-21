import { Component } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { RouterModule } from '@angular/router';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-landing',
  imports: [RouterModule, TitleCasePipe],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  categories = [
    {
      name: 'Fragrances',
      description: 'Perfumes and scents for men and women.',
      image: '/assets/categories/fragrance.jpg',
    },
    {
      name: 'Furniture',
      description: 'Stylish and functional furniture for home and office.',
      image: '/assets/categories/furniture.jpg',
    },
    {
      name: 'Groceries',
      description: 'Fresh groceries, staples, and household essentials.',
      image: '/assets/categories/grocery.jpg',
    },
    {
      name: 'Beauty',
      description: 'Skincare, makeup, and wellness products.',
      image: '/assets/categories/beauty.jpg',
    },
    {
      name: 'sports-accessories',
      description: 'Equipment and gear for sports and fitness.',
      image: '/assets/categories/sport.jpg',
    },
    {
      name: 'kitchen-accessories',
      description: 'Cookware, utensils, and kitchen essentials.',
      image: '/assets/categories/kitchen.jpg',
    },
    {
      name: 'Laptops',
      description: 'Latest laptops and computer accessories.',
      image: '/assets/categories/laptop.jpg',
    },
    {
      name: 'womens-dresses',
      description: 'Fashionable dresses and outfits for women.',
      image: '/assets/categories/women-dresses.jpg',
    },
  ];
}
