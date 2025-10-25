import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  imports: [RouterModule, TitleCasePipe, FormsModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing implements OnInit, OnDestroy {
  isNavOpen = false;
  activeIndex = 0;

  autoSlideInterval: any;

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

  ngOnInit() {
    // Auto-slide every 4 seconds
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  ngOnDestroy() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  prevSlide() {
    this.activeIndex =
      this.activeIndex === 0
        ? this.categories.length - 1
        : this.activeIndex - 1;
  }

  nextSlide() {
    this.activeIndex =
      this.activeIndex === this.categories.length - 1
        ? 0
        : this.activeIndex + 1;
  }

  openNav() {
    this.isNavOpen = true;
  }

  closeNav() {
    this.isNavOpen = false;
  }
}
