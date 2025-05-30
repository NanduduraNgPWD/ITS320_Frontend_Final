import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Recipe {
  id?: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  prepTime: number;
  cookTime: number;
  servings: number;
  image?: string;
  author: string;
  category: string;
  tags: string[];
}

interface Ingredient {
  quantity: string;
  unit: string;
  name: string;
  group?: string;
}

interface Instruction {
  step: number;
  text: string;
  image?: string;
}

// API Response interfaces matching your backend structure
interface ApiIngredient {
  quantity: string;
  unit: string;
  name: string;
  group: string;
  _id: string;
}

interface ApiInstruction {
  step: number;
  text: string;
  image: string;
  _id: string;
}

interface ApiRecipe {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  ingredients: ApiIngredient[];
  instructions: ApiInstruction[];
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
  data?: ApiRecipe;
  message?: string;
}

@Component({
  selector: 'recipe-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-page.component.html'
})
export class RecipePageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private http = inject(HttpClient);

  recipe = signal<Recipe | null>(null);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  private readonly API_BASE_URL = 'http://localhost:3000/api';

  ngOnInit(): void {
    // Get recipe ID from route parameters
    this.route.params.subscribe(params => {
      const recipeId = params['id'];
      if (recipeId) {
        this.loadRecipe(recipeId);
      } else {
        this.error.set('Recipe ID not found');
      }
    });
  }

  private loadRecipe(recipeId: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    // Fetch recipe from your API endpoint
    this.http.get<ApiResponse>(`${this.API_BASE_URL}/${recipeId}`).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const mappedRecipe = this.mapApiRecipeToRecipe(response.data);
          this.recipe.set(mappedRecipe);
        } else {
          this.error.set(response.message || 'Recipe not found');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching recipe:', err);
        this.error.set('Failed to load recipe. Please try again.');
        this.isLoading.set(false);
      }
    });
  }

  private mapApiRecipeToRecipe(apiRecipe: ApiRecipe): Recipe {
    return {
      id: apiRecipe._id,
      title: apiRecipe.title,
      description: apiRecipe.description,
      ingredients: apiRecipe.ingredients.map(ingredient => ({
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        name: ingredient.name,
        group: ingredient.group
      })),
      instructions: apiRecipe.instructions.map(instruction => ({
        step: instruction.step,
        text: instruction.text,
        image: instruction.image || undefined
      })),
      prepTime: apiRecipe.prepTime,
      cookTime: apiRecipe.cookTime,
      servings: apiRecipe.servings,
      image: apiRecipe.image || undefined,
      author: apiRecipe.author,
      category: apiRecipe.category,
      tags: apiRecipe.tags
    };
  }

  // Method to refresh recipe data
  refreshRecipe(): void {
    const recipeId = this.route.snapshot.params['id'];
    if (recipeId) {
      this.loadRecipe(recipeId);
    }
  }

  // Method to go back to recipes list
  goBack(): void {
    this.router.navigate(['/recipes']);
  }

  // Method to get total cooking time
  get totalTime(): number {
    const recipe = this.recipe();
    return recipe ? recipe.prepTime + recipe.cookTime : 0;
  }
}