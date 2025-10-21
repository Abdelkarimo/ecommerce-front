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
      description: 'Latest gadgets and smart devices.',
      image: '/assets/categories/fragrance.jpg',
    },
    {
      name: 'Furniture',
      description: 'Trendy clothing and accessories for all.',
      image: '/assets/categories/furniture.jpg',
    },
    {
      name: 'Groceries',
      description: 'Everything you need for your home.',
      image: '/assets/categories/grocery.jpg',
    },
    {
      name: 'Beauty',
      description: 'Skincare, makeup, and wellness essentials.',
      image: '/assets/categories/beauty.jpg',
    },
    {
      name: 'sports-accessories',
      description: 'Gear up for fitness and adventure.',
      image: '/assets/categories/sport.jpg',
    },
    {
      name: 'kitchen-accessories',
      description: 'Explore our wide collection of books.',
      image: '/assets/categories/kitchen.jpg',
    },
    {
      name: 'Laptops',
      description: 'Fun and creative toys for kids.',
      image: '/assets/categories/laptop.jpg',
    },
    {
      name: 'womens-dresses',
      description: 'Accessories and tools for your vehicle.',
      image: '/assets/categories/women-dresses.jpg',
    },
  ];
}
