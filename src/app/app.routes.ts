import { Routes } from '@angular/router';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { RecipesComponent } from './pages/recipes/recipes.component';
import { RecipeFormComponent } from './components/recipe-form/recipe-form.component';
import { ProfileComponent } from './pages/profile/profile.component';
// import { authGuard } from './guards/auth.guard';
// import { authProtectedGuard } from './guards/auth-protected.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'home', component: HeroSectionComponent },
    { path: 'recipes', component: RecipesComponent },
    { path: 'recipe-form', component: RecipeFormComponent },
    { path: 'profile', component: ProfileComponent },
    // { path: 'todo', component: ToDoListComponent }
    // { path: '', redirectTo: 'login', pathMatch: 'full' }
];


// export const routes: Routes = [
//     { path: 'login', component: LoginComponent, canActivate: [authGuard] },
//     { path: 'register', component: SignupComponent, canActivate: [authGuard] },
//     { path: 'home', component: HomeComponent, canActivate: [authProtectedGuard] },
//     { path: 'todo', component: ToDoListComponent, canActivate: [authProtectedGuard] },
//     { path: '', redirectTo: 'login', pathMatch: 'full' }
// ];
