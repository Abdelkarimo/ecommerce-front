import { Component } from '@angular/core';
import { Navbar } from '../../../shared/components/navbar/navbar';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [RouterModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  categories = [
    {
      name: 'Fragrances',
      description: 'Latest gadgets and smart devices.',
      image: 'https://picsum.photos/400/300?tech',
    },
    {
      name: 'Furniture',
      description: 'Trendy clothing and accessories for all.',
      image: 'https://picsum.photos/400/300?clothes',
    },
    {
      name: 'Groceries',
      description: 'Everything you need for your home.',
      image: 'https://picsum.photos/400/300?home',
    },
    {
      name: 'Beauty',
      description: 'Skincare, makeup, and wellness essentials.',
      image: 'https://picsum.photos/400/300?beauty',
    },
    {
      name: 'Vehicle',
      description: 'Gear up for fitness and adventure.',
      image: 'https://picsum.photos/400/300?sports',
    },
    {
      name: 'kitchen-accessories',
      description: 'Explore our wide collection of books.',
      image: 'https://picsum.photos/400/300?books',
    },
    {
      name: 'Laptops',
      description: 'Fun and creative toys for kids.',
      image: 'https://picsum.photos/400/300?toys',
    },
    {
      name: 'Automotive',
      description: 'Accessories and tools for your vehicle.',
      image: 'https://picsum.photos/400/300?car',
    },
  ];
}
