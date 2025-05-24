import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <header class="py-4 px-4 md:px-8 border-b border-gray-200">
        <nav class="flex justify-between items-center max-w-7xl mx-auto">
            <div class="logo flex items-center font-zain">
                <a routerLink="/home" class="text-2xl">
                    <img src="assets/LOGO.svg" alt="Food" class="" />
                </a>
            </div>

            <div class="hidden md:flex space-x-14">
                <a routerLink="/home" class="font-medium">Home</a>
                <a (click)="handleProtectedRoute('/recipes')" class="font-medium cursor-pointer">Recipes</a>
                <a (click)="handleProtectedRoute('/features')" class="font-medium cursor-pointer">Features</a>
                <a (click)="handleProtectedRoute('/contact')" class="font-medium cursor-pointer">Contact</a>
            </div>

            <div class="flex items-center space-x-4">
                <!-- Show login/signup buttons when not logged in -->
                <div *ngIf="!isLoggedIn()" class="flex items-center space-x-4">
                    <a routerLink="/login" class="font-medium">Login</a>
                    <a routerLink="/signup" class="border border-gray-800 rounded-full px-6 py-2 font-medium">Signup</a>
                </div>
                
                <!-- Show logout button when logged in -->
                <div *ngIf="isLoggedIn()">
                    <button (click)="logout()" class="border border-red-600 text-red-600 rounded-full px-6 py-2 font-medium hover:bg-red-600 hover:text-white transition-colors">
                        Logout
                    </button>
                </div>
            </div>
        </nav>

        <!-- Modal for unauthorized access -->
        <div *ngIf="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
                <h3 class="text-lg font-semibold mb-2">Login Required</h3>
                <p class="text-gray-600 mb-4">You need to log in first to access this page.</p>
                <div class="flex justify-end space-x-2">
                    <button (click)="closeModal()" class="px-4 py-2 text-gray-600 hover:text-gray-800">
                        Cancel
                    </button>
                    <button (click)="goToLogin()" class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
                        OK
                    </button>
                </div>
            </div>
        </div>
    </header>
  `
})
export class NavbarComponent {
  private router = inject(Router);
  showModal = false;

  // Replace this with your actual auth service method
  isLoggedIn(): boolean {
    // This should check your actual authentication state
    // For example: return this.authService.isAuthenticated();
    return !!localStorage.getItem('token'); // Simple example
  }

  handleProtectedRoute(route: string): void {
    if (this.isLoggedIn()) {
      this.router.navigate([route]);
    } else {
      this.showModal = true;
    }
  }

  logout(): void {
    // Clear authentication data
    localStorage.removeItem('token'); // Adjust based on your auth implementation
    // You might also want to call your auth service logout method
    // this.authService.logout();

    // Redirect to home page
    this.router.navigate(['/home']);
  }

  closeModal(): void {
    this.showModal = false;
  }

  goToLogin(): void {
    this.showModal = false;
    this.router.navigate(['/login']);
  }
}