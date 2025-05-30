import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Update your Recipe interface in recipe-card.component.ts
export interface Recipe {
  id: string;
  title: string;
  image: string;
  views: number;
  description: string;
  category?: string;
  tags?: string[];
  ingredients?: Array<{
    quantity: string;
    unit: string;
    name: string;
    group: string;
    _id: string;
  }>;
  instructions?: Array<{
    step: number;
    text: string;
    image: string;
    _id: string;
  }>;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  author?: string;
}

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-card.component.html',
})
export class RecipeCardComponent {
  @Input({ required: true }) recipe!: Recipe;

  constructor(private router: Router) { }

  onSeeRecipe(): void {
    this.router.navigate(['/recipe-page', this.recipe.id]);
  }

}