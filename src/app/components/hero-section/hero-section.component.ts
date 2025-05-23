import { Component } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';
interface RecipeCard {
  id: number;
  image: string;
  title: string;
  badge?: {
    text: string;
    icon: string;
  };
}

@Component({
  selector: 'app-hero-section',
  standalone: true,
  templateUrl: './hero-section.component.html',
  imports: [NgIf, NgFor, RouterModule]
})
export class HeroSectionComponent {

  featuredRecipes: RecipeCard[] = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Spiced Rice Bowl',
      badge: {
        text: 'Trending',
        icon: '🔥'
      }
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Herb Crusted Chicken',
      badge: {
        text: 'Most Appreciated',
        icon: '🏆'
      }
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Mediterranean Salad Bowl',

    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Glazed Salmon Noodles',

    }
  ];

}