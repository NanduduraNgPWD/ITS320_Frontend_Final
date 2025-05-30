import { Component, signal, OnInit, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RecipeCardComponent, Recipe } from '../../components/recipe-card/recipe-card.component';

interface Category {
  id: string;
  name: string;
  icon: string;
}

// API Response interface matching your backend structure
interface ApiRecipe {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  ingredients: Array<{
    quantity: string;
    unit: string;
    name: string;
    group: string;
    _id: string;
  }>;
  instructions: Array<{
    step: number;
    text: string;
    image: string;
    _id: string;
  }>;
  prepTime: number;
  cookTime: number;
  servings: number;
  author: string;
  image: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  count: number;
  data: ApiRecipe[];
}

@Component({
  selector: 'app-recipes',
  imports: [NgFor, NgIf, RecipeCardComponent],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css'
})
export class RecipesComponent implements OnInit {
  private http = inject(HttpClient);

  selectedCategory = signal<string>('all-types');
  recipes = signal<Recipe[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  private readonly API_URL = 'http://localhost:3000/api/getrecipe';

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

  ngOnInit(): void {
    this.loadRecipes();
  }

  private loadRecipes(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.get<ApiResponse>(this.API_URL).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const mappedRecipes = response.data.map(this.mapApiRecipeToRecipe);
          this.recipes.set(mappedRecipes);
        } else {
          this.error.set('Failed to load recipes');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching recipes:', err);
        this.error.set('Failed to load recipes. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  private mapApiRecipeToRecipe(apiRecipe: ApiRecipe): Recipe {
    return {
      id: apiRecipe._id,
      title: apiRecipe.title,
      image: apiRecipe.image || 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', // fallback image
      views: 0, // API doesn't provide views, so defaulting to 0
      description: apiRecipe.description,
      category: apiRecipe.category,
      tags: apiRecipe.tags,
      ingredients: apiRecipe.ingredients,
      instructions: apiRecipe.instructions,
      prepTime: apiRecipe.prepTime,
      cookTime: apiRecipe.cookTime,
      servings: apiRecipe.servings,
      author: apiRecipe.author
    };
  }

  //Getter for filtered recipes
  get filteredRecipes(): Recipe[] {
    const allRecipes = this.recipes();

    if (this.selectedCategory() === 'all-types') {
      return allRecipes;
    }

    // Filter by category - you might need to adjust this logic based on your category mapping
    return allRecipes.filter(recipe => {
      const selectedCat = this.selectedCategory();

      // Map your frontend categories to backend categories
      switch (selectedCat) {
        case 'appetizers':
          return recipe.category === 'appetizer' || recipe.tags?.includes('appetizer');
        case 'main-courses':
          return recipe.category === 'main-course' || recipe.category === 'dinner' || recipe.tags?.includes('main');
        case 'salads-sides':
          return recipe.category === 'salad' || recipe.category === 'side' || recipe.tags?.includes('side');
        case 'vegetarian':
          return recipe.category === 'vegetarian' || recipe.tags?.includes('vegetarian');
        case 'international':
          return recipe.tags?.includes('international') || recipe.tags?.includes('ethnic');
        case 'desserts':
          return recipe.category === 'dessert' || recipe.tags?.includes('dessert') || recipe.tags?.includes('sweet');
        case 'healthy':
          return recipe.tags?.includes('healthy') || recipe.tags?.includes('low-calorie');
        case 'quick-easy':
          return recipe.tags?.includes('quick') || recipe.tags?.includes('easy') ||
            ((recipe.prepTime || 0) + (recipe.cookTime || 0)) <= 30;
        default:
          return recipe.category === selectedCat;
      }
    });
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

  // Method to refresh recipes
  refreshRecipes(): void {
    this.loadRecipes();
  }
}