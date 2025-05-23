import { Routes } from '@angular/router';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { RecipesComponent } from './pages/recipes/recipes.component';
// import { authGuard } from './guards/auth.guard';
// import { authProtectedGuard } from './guards/auth-protected.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'home', component: HeroSectionComponent },
    { path: 'recipes', component: RecipesComponent },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];

// Future implementation with guards:
// export const routes: Routes = [
//     { path: 'login', component: LoginComponent, canActivate: [authGuard] },
//     { path: 'signup', component: SignupComponent, canActivate: [authGuard] },
//     { path: 'home', component: HeroSectionComponent, canActivate: [authProtectedGuard] },
//     { path: 'recipes', component: RecipesComponent, canActivate: [authProtectedGuard] },
//     { path: '', redirectTo: '/login', pathMatch: 'full' }
// ];