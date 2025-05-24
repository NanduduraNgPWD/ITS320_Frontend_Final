import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);

  canActivate(): boolean {
    // Replace this with your actual authentication check
    const isAuthenticated = !!localStorage.getItem('token'); // Simple example
    
    if (!isAuthenticated) {
      // Redirect to login page if not authenticated
      this.router.navigate(['/login']);
      return false;
    }
    
    return true;
  }
}