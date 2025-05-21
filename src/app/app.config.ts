import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';

// Define routes
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./app.component').then(m => m.AppComponent) },
  { path: '**', redirectTo: 'home' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
  ]
};