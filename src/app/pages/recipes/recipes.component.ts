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
      image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      views: 250,
      description: 'A refreshing mix of crisp greens topped with a creamy, tangy tahini dressing—perfect for a light and healthy meal.'
    },
    {
      id: '2',
      title: 'Chili con Carne with Nachos',
      image: 'https://plus.unsplash.com/premium_photo-1671403963864-6d46f3b62352?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Zm9vZCUyMHBsYXRlfGVufDB8fDB8fHww',
      views: 150,
      description: 'Hearty and flavorful chili packed with tender beef, beans, and spices, served with crispy nacho chips.'
    },
    {
      id: '3',
      title: 'Sour & Spicy Korean Kimchi',
      image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZCUyMHBsYXRlfGVufDB8fDB8fHww',
      views: 200,
      description: 'Traditional fermented Korean cabbage with bold, spicy, and tangy flavors—great as a side or ingredient.'
    },
    {
      id: '4',
      title: 'Mediterranean Grilled Chicken',
      image: 'https://images.unsplash.com/photo-1723362120818-bc8b54e8229d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGZvb2QlMjBwbGF0ZXxlbnwwfHwwfHx8MA%3D%3D',
      views: 180,
      description: 'Juicy grilled chicken marinated in herbs, lemon, and olive oil—served with a fresh Mediterranean twist.'
    },
    {
      id: '5',
      title: 'Chocolate Lava Cake',
      image: 'https://images.unsplash.com/photo-1710091691771-96b2e6d17dac?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjZ8fGZvb2QlMjBwbGF0ZXxlbnwwfHwwfHx8MA%3D%3D',
      views: 320,
      description: 'A rich and decadent dessert with a warm, gooey chocolate center that oozes with every bite.'
    },
    {
      id: '6',
      title: 'Asian Stir Fry Vegetables',
      image: 'https://plus.unsplash.com/premium_photo-1670263779633-5309cae32f13?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDV8fGZvb2QlMjBwbGF0ZXxlbnwwfHwwfHx8MA%3D%3D',
      views: 140,
      description: 'A colorful medley of crisp vegetables tossed in a savory soy-based sauce for a quick and healthy dish.'
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