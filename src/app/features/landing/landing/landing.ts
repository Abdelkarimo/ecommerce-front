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
  /** Controls the navigation menu visibility (for mobile or sidebar use) */
  isNavOpen = false;

  /** Index of the currently active category in the carousel */
  activeIndex = 0;

  /** Holds the interval reference for auto-sliding the carousel */
  autoSlideInterval: any;

  /** 🏷️ List of product categories displayed on the landing page */
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

  // 🔹 Lifecycle Hooks
  /** Starts the auto-slide carousel when the component initializes */
  ngOnInit() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 4000); // Slide every 4 seconds
  }

  /** Clears the auto-slide interval when component is destroyed */
  ngOnDestroy() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  // 🔹 Carousel Controls
  /** Moves the carousel to the previous category */
  prevSlide() {
    this.activeIndex =
      this.activeIndex === 0
        ? this.categories.length - 1
        : this.activeIndex - 1;
  }

  /** Moves the carousel to the next category */
  nextSlide() {
    this.activeIndex =
      this.activeIndex === this.categories.length - 1
        ? 0
        : this.activeIndex + 1;
  }

  // 🔹 Navigation Controls
  /** Opens the navigation menu */
  openNav() {
    this.isNavOpen = true;
  }

  /** Closes the navigation menu */
  closeNav() {
    this.isNavOpen = false;
  }
}
