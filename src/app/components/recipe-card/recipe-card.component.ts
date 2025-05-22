import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Recipe {
  id: string;
  title: string;
  image: string;
  views: number;
}

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recipe-card.component.html',
})
export class RecipeCardComponent {
  @Input({ required: true }) recipe!: Recipe;

  onSeeRecipe(): void {
    // Handle recipe click - emit event or navigate
    console.log('View recipe:', this.recipe.id);
  }
}