import { Routes } from '@angular/router';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { RecipesComponent } from './pages/recipes/recipes.component';
import { ProfileComponent } from './pages/profile/profile.component'
import { RecipeFormComponent } from './components/recipe-form/recipe-form.component';
// You'll need to create these components
// import { FeaturesComponent } from './pages/features/features.component';
// import { ContactComponent } from './pages/contact/contact.component';
import { AuthGuard } from './guards/auth.guard';
import { RedirectGuard } from './guards/redirect.guard';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [RedirectGuard] // Redirect to home if already logged in
    },
    {
        path: 'recipe-form',
        component: RecipeFormComponent

    },
    {
        path: 'signup',
        component: SignupComponent,
        canActivate: [RedirectGuard] // Redirect to home if already logged in
    },
    {
        path: 'home',
        component: HeroSectionComponent
    },
    {
        path: 'recipes',
        component: RecipesComponent,
        canActivate: [AuthGuard] // Protect this route - require authentication
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard] // Protect this route - require authentication
    },
    // Uncomment these when you create the components
    // { 
    //     path: 'features', 
    //     component: FeaturesComponent,
    //     canActivate: [AuthGuard] // Protect this route - require authentication
    // },
    // { 
    //     path: 'contact', 
    //     component: ContactComponent,
    //     canActivate: [AuthGuard] // Protect this route - require authentication
    // },
    {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/home'
    }
];