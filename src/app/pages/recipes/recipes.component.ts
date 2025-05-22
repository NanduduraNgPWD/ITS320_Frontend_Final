import { Component, signal } from '@angular/core';
import { NgFor } from '@angular/common';
import { RecipeCardComponent, Recipe } from '../../components/recipe-card/recipe-card.component';

interface Category {
  id: string;
  name: string;
  icon: string;
}

@Component({
  selector: 'app-recipes',
  imports: [NgFor, RecipeCardComponent],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css'
})
export class RecipesComponent {
  selectedCategory = signal<string>('all-types');

  categories: Category[] = [
    { id: 'all-types', name: 'All Types', icon: '🍽️' },
    { id: 'appetizers', name: 'Appetizers', icon: '🥖' },
    { id: 'main-courses', name: 'Main Courses', icon: '🍖' },
    { id: 'salads-sides', name: 'Salads & Sides', icon: '🥗' },
    { id: 'vegetarian', name: 'Vegetarian Delights', icon: '🥕' },
    { id: 'international', name: 'International Flavors', icon: '🌍' },
    { id: 'desserts', name: 'Desserts & Sweets', icon: '🍰' },
    { id: 'healthy', name: 'Healthy Eats', icon: '💚' },
    { id: 'quick-easy', name: 'Quick & Easy Supper', icon: '⏰' }
  ];

  // static data recipes
  recipes: Recipe[] = [
    {
      id: '1',
      title: 'Fresh Salad with Tahini Sauce',
      image: '/api/placeholder/400/320',
      views: 250
    },
    {
      id: '2',
      title: 'Chili con Carne with Nachos Chips',
      image: '/api/placeholder/400/320',
      views: 150
    },
    {
      id: '3',
      title: 'Sour & Spicy Korean Kimchi',
      image: '/api/placeholder/400/320',
      views: 200
    },
    {
      id: '4',
      title: 'Mediterranean Grilled Chicken',
      image: '/api/placeholder/400/320',
      views: 180
    },
    {
      id: '5',
      title: 'Chocolate Lava Cake',
      image: '/api/placeholder/400/320',
      views: 320
    },
    {
      id: '6',
      title: 'Asian Stir Fry Vegetables',
      image: '/api/placeholder/400/320',
      views: 140
    }
  ];

  //Getter for filtered recipes
  get filteredRecipes(): Recipe[] {
    // add filtering logic later 
    return this.recipes;
  }

  selectCategory(categoryId: string): void {
    this.selectedCategory.set(categoryId);
    console.log('Selected category:', categoryId);
  }

  getButtonClasses(categoryId: string): string {
    const isSelected = this.selectedCategory() === categoryId;

    if (isSelected) {
      return 'bg-gray-900 text-gray-50';
    }

    return 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:border-gray-300';
  }
}