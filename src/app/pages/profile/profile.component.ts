import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
// Interface for API Recipe response
interface ApiRecipe {
  _id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  ingredients: any[];
  instructions: any[];
  prepTime: number;
  cookTime: number;
  servings: number;
  author: string;
  image: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  likes?: number;
  views?: number;
}

// Interface for your local recipe display
interface UserRecipe {
  id: string;
  title: string;
  description: string;
  cookTime: string;
  servings: number;
  difficulty: string;
  likes: number;
  views: number;
  image: string;
  createdAt: string;
  status: string;
  category?: string;
  prepTime?: number;
}

// API Response interfaces
interface ApiRecipesResponse {
  success: boolean;
  data?: ApiRecipe[];
  message?: string;
  total?: number;
}

@Component({
  selector: 'profile',
  imports: [NgFor, NgIf, RouterModule, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  activeTab = 'profile';
  private router = inject(Router);
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // API Configuration
  private readonly API_BASE_URL = 'http://localhost:3000/api';

  // Signals for reactive state management
  userRecipes = signal<UserRecipe[]>([]);
  isLoadingRecipes = signal<boolean>(false);
  recipesError = signal<string | null>(null);
  totalRecipes = signal<number>(0);

  navigationItems = [
    { key: 'profile', label: 'My Profile' },
    { key: 'recipes', label: 'My Recipes' },
    { key: 'Community', label: 'Community' },
    { key: 'Friends', label: 'Friends' },
    { key: 'Security', label: 'Security' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'billing', label: 'Billing' },
    { key: 'data-export', label: 'Data Export' }
  ];

  userProfile = {
    name: 'Dave Chester Gealolo',
    role: 'Project Manager',
    location: 'Purok Oplok, Hinigaran',
    firstName: 'Dave Chester',
    lastName: 'Gealolo',
    email: 'Gealolo@gmail.com',
    phone: '+09 345 346 46',
    bio: 'Team Manager',
    address: {
      country: 'Philippines',
      cityState: 'Hinigaran, Negros Occidental',
      postalCode: '6969',
      taxId: 'AS45645756'
    }
  };

  ngOnInit(): void {
    // Load user recipes if starting on recipes tab
    if (this.activeTab === 'recipes') {
      this.loadUserRecipes();
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;

    // Load recipes when switching to recipes tab
    if (tab === 'recipes') {
      this.loadUserRecipes();
    }
  }

  private loadUserRecipes(): void {
    this.isLoadingRecipes.set(true);
    this.recipesError.set(null);
    const userId = this.authService.currentUser?.id;

    if (!userId) {
      this.recipesError.set('User is not logged in.');
      this.isLoadingRecipes.set(false);
      return;
    }
    // Try multiple endpoints based on your API structure
    const endpoints = [
      `${this.API_BASE_URL}/getrecipe`,
      `${this.API_BASE_URL}/recipes?author=${encodeURIComponent(userId)}`,
      `${this.API_BASE_URL}/users/me/recipes`
    ];

    // Try the first endpoint, fallback to others if needed
    this.tryFetchRecipes(endpoints, 0);
  }

  private tryFetchRecipes(endpoints: string[], index: number): void {
    if (index >= endpoints.length) {
      this.recipesError.set('Unable to load recipes from any endpoint');
      this.isLoadingRecipes.set(false);
      return;
    }

    const endpoint = endpoints[index];
    console.log(`Trying endpoint: ${endpoint}`);

    this.http.get<ApiRecipesResponse>(endpoint).subscribe({
      next: (response) => {
        console.log('API Response:', response);

        if (response.success && response.data) {
          const mappedRecipes = response.data.map(recipe => this.mapApiRecipeToUserRecipe(recipe));
          this.userRecipes.set(mappedRecipes);
          this.totalRecipes.set(response.total || response.data.length);
          console.log('Mapped recipes:', mappedRecipes);
        } else {
          this.recipesError.set(response.message || 'Failed to load recipes');
        }
        this.isLoadingRecipes.set(false);
      },
      error: (err) => {
        console.error(`Error with endpoint ${endpoint}:`, err);

        // If this endpoint failed, try the next one
        if (index < endpoints.length - 1) {
          this.tryFetchRecipes(endpoints, index + 1);
        } else {
          this.recipesError.set('Failed to load your recipes. Please try again.');
          this.isLoadingRecipes.set(false);
        }
      }
    });
  }

  private mapApiRecipeToUserRecipe(apiRecipe: ApiRecipe): UserRecipe {
    return {
      id: apiRecipe._id,
      title: apiRecipe.title,
      description: apiRecipe.description,
      cookTime: `${apiRecipe.cookTime} mins`,
      servings: apiRecipe.servings,
      difficulty: this.getDifficultyFromCookTime(apiRecipe.cookTime + apiRecipe.prepTime),
      likes: apiRecipe.likes || 0,
      views: apiRecipe.views || 0,
      image: apiRecipe.image || this.getDefaultImage(apiRecipe.category),
      createdAt: apiRecipe.createdAt,
      status: apiRecipe.status,
      category: apiRecipe.category,
      prepTime: apiRecipe.prepTime
    };
  }

  private getDifficultyFromCookTime(totalTime: number): string {
    if (totalTime <= 30) return 'Easy';
    if (totalTime <= 60) return 'Medium';
    return 'Hard';
  }

  private getDefaultImage(category: string): string {
    const defaultImages: { [key: string]: string } = {
      'Dessert': 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&h=200&fit=crop',
      'Main Course': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop',
      'Appetizer': 'https://images.unsplash.com/photo-1541414779316-956a5084c0d4?w=300&h=200&fit=crop',
      'Salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
      'Soup': 'https://images.unsplash.com/photo-1547592180-85f173990554?w=300&h=200&fit=crop'
    };

    return defaultImages[category] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop';
  }

  // Method to refresh recipes
  refreshRecipes(): void {
    this.loadUserRecipes();
  }

  // Method to delete a recipe
  deleteRecipe(recipeId: string): void {
    if (confirm('Are you sure you want to delete this recipe?')) {
      this.http.delete(`${this.API_BASE_URL}/delete/${recipeId}`).subscribe({
        next: () => {
          // Remove recipe from local state
          const currentRecipes = this.userRecipes();
          const updatedRecipes = currentRecipes.filter(recipe => recipe.id !== recipeId);
          this.userRecipes.set(updatedRecipes);
          this.totalRecipes.set(this.totalRecipes() - 1);
        },
        error: (err) => {
          console.error('Error deleting recipe:', err);
          alert('Failed to delete recipe. Please try again.');
        }
      });
    }
  }

  // Method to edit a recipe
  editRecipe(recipeId: string): void {
    this.router.navigate(['/recipes/edit', recipeId]);
  }

  // Method to view a recipe
  viewRecipe(recipeId: string): void {
    this.router.navigate(['/recipe-page', recipeId]);
  }

  logout(): void {
    // Clear authentication data
    localStorage.removeItem('token'); // Adjust based on your auth implementation
    // You might also want to call your auth service logout method
    // this.authService.logout();

    // Redirect to home page
    this.router.navigate(['/home']);
  }

  getNavItemClass(item: any): string {
    const baseClasses = 'w-full text-left px-3 py-2 rounded-md text-sm transition-colors';

    if (item.key === 'delete-account') {
      return `${baseClasses} text-red-600 hover:bg-red-50`;
    }

    if (item.key === this.activeTab) {
      return `${baseClasses} bg-gray-100 text-gray-800 font-medium`;
    }

    return `${baseClasses} text-gray-600 hover:bg-gray-100 hover:text-gray-800`;
  }

  getStatusClass(status: string): string {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';

    if (status === 'Published' || status === 'published') {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else if (status === 'Draft' || status === 'draft') {
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }

    return `${baseClasses} bg-gray-100 text-gray-800`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}