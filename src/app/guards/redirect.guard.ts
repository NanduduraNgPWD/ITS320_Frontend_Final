import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RedirectGuard implements CanActivate {
  private router = inject(Router);

  canActivate(): boolean {
    // Replace this with your actual authentication check
    const isAuthenticated = !!localStorage.getItem('token'); // Simple example
    
    if (isAuthenticated) {
      // Redirect to home page if already authenticated
      this.router.navigate(['/home']);
      return false;
    }
    
    return true;
  }
}