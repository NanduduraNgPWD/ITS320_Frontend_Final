import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'profile',
  imports: [NgFor, NgIf, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  activeTab = 'profile';

  navigationItems = [
    { key: 'profile', label: 'My Profile' },
    { key: 'recipes', label: 'My Recipes' },
    { key: 'security', label: 'Security' },
    { key: 'teams', label: 'Teams' },
    { key: 'team-member', label: 'Team Member' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'billing', label: 'Billing' },
    { key: 'data-export', label: 'Data Export' },
    { key: 'delete-account', label: 'Delete Account' }
  ];

  userProfile = {
    name: 'Dave Chester Gealolo',
    role: 'Project Manager',
    location: 'Purok Oplok, Hinigaran',
    firstName: 'Dave Chester',
    lastName: 'Gealolo',
    email: 'Gealolo@gmail.com',
    phone: '+09 345 346 46',
    bio: 'Team Manager',
    address: {
      country: 'Philippines',
      cityState: 'Hinigaran, Negros Occidental',
      postalCode: '6969',
      taxId: 'AS45645756'
    }
  };

  userRecipes = [
    {
      id: 1,
      title: 'Spicy Thai Curry',
      description: 'A delicious and aromatic Thai curry with coconut milk and fresh herbs',
      cookTime: '45 mins',
      servings: 4,
      difficulty: 'Medium',
      likes: 127,
      views: 1240,
      image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=300&h=200&fit=crop',
      createdAt: '2024-01-15',
      status: 'Published'
    },
    {
      id: 2,
      title: 'Classic Chocolate Chip Cookies',
      description: 'Soft and chewy cookies with premium chocolate chips, perfect for any occasion',
      cookTime: '25 mins',
      servings: 24,
      difficulty: 'Easy',
      likes: 89,
      views: 856,
      image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&h=200&fit=crop',
      createdAt: '2024-01-10',
      status: 'Published'
    },
    {
      id: 3,
      title: 'Mediterranean Quinoa Salad',
      description: 'Fresh and healthy salad with quinoa, olives, tomatoes, and feta cheese',
      cookTime: '20 mins',
      servings: 6,
      difficulty: 'Easy',
      likes: 45,
      views: 324,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&h=200&fit=crop',
      createdAt: '2024-01-08',
      status: 'Draft'
    }
  ];


  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  getNavItemClass(item: any): string {
    const baseClasses = 'w-full text-left px-3 py-2 rounded-md text-sm transition-colors';

    if (item.key === 'delete-account') {
      return `${baseClasses} text-red-600 hover:bg-red-50`;
    }

    if (item.key === this.activeTab) {
      return `${baseClasses} bg-gray-100 text-gray-800 font-medium`;
    }

    return `${baseClasses} text-gray-600 hover:bg-gray-100 hover:text-gray-800`;
  }

  getStatusClass(status: string): string {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';

    if (status === 'Published') {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else if (status === 'Draft') {
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    }

    return `${baseClasses} bg-gray-100 text-gray-800`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

}