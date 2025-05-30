import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Recipe {
  id?: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: Instruction[];
  prepTime: number;
  cookTime: number;
  servings: number;
  image?: string;
  author: string;
  category: string;
  tags: string[];
  status?: 'draft' | 'published';
  createdAt?: Date;
  updatedAt?: Date;
}

interface Ingredient {
  quantity: string;
  unit: string;
  name: string;
  group?: string;
}

interface Instruction {
  step: number;
  text: string;
  image?: string;
}

@Component({
  selector: 'recipe-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './recipe-form.component.html'
})
export class RecipeFormComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api'; // Add this property at the top

  currentStep = signal(1);
  totalSteps = 7;

  stepTitles = ['Details', 'Ingredients', 'Instructions', 'Timing', 'Images', 'Review', 'Submit'];

  categories = [
    { value: 'appetizer', label: 'Appetizer' },
    { value: 'main-course', label: 'Main Course' },
    { value: 'dessert', label: 'Dessert' },
    { value: 'beverage', label: 'Beverage' },
    { value: 'snack', label: 'Snack' },
    { value: 'breakfast', label: 'Breakfast' }
  ];

  units = [
    'cup', 'cups', 'tbsp', 'tsp', 'oz', 'lb', 'g', 'kg', 'ml', 'l', 'piece', 'pieces', 'clove', 'cloves'
  ];

  tags = signal<string[]>([]);
  newTag = '';
  imagePreview = signal<string | null>(null);
  submissionStatus = signal<'success' | 'error' | 'loading' | null>(null);
  submissionMessage = signal<string>('');

  recipeForm: FormGroup;

  constructor() {
    this.recipeForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      category: ['', Validators.required],
      ingredients: this.fb.array([]),
      instructions: this.fb.array([]),
      prepTime: [0, [Validators.required, Validators.min(0)]],
      cookTime: [0, [Validators.required, Validators.min(0)]],
      servings: [1, [Validators.required, Validators.min(1)]],
      author: ['', Validators.required],
      image: ['']
    });

    // Add initial ingredient and instruction
    this.addIngredient();
    this.addInstruction();
  }

  get ingredientsArray() {
    return this.recipeForm.get('ingredients') as FormArray;
  }

  get instructionsArray() {
    return this.recipeForm.get('instructions') as FormArray;
  }

  progressPercentage = computed(() => {
    return (this.currentStep() / this.totalSteps) * 100;
  });

  addTag() {
    if (this.newTag.trim() && !this.tags().includes(this.newTag.trim())) {
      this.tags.update(tags => [...tags, this.newTag.trim()]);
      this.newTag = '';
    }
  }

  removeTag(index: number) {
    this.tags.update(tags => tags.filter((_, i) => i !== index));
  }

  addIngredient() {
    const ingredientGroup = this.fb.group({
      quantity: ['', Validators.required],
      unit: [''],
      name: ['', Validators.required],
      group: ['']
    });
    this.ingredientsArray.push(ingredientGroup);
  }

  removeIngredient(index: number) {
    if (this.ingredientsArray.length > 1) {
      this.ingredientsArray.removeAt(index);
    }
  }

  addInstruction() {
    const instructionGroup = this.fb.group({
      step: [this.instructionsArray.length + 1],
      text: ['', Validators.required],
      image: ['']
    });
    this.instructionsArray.push(instructionGroup);
  }

  removeInstruction(index: number) {
    if (this.instructionsArray.length > 1) {
      this.instructionsArray.removeAt(index);
      // Update step numbers
      this.instructionsArray.controls.forEach((control, i) => {
        control.get('step')?.setValue(i + 1);
      });
    }
  }

  onImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file.');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview.set(e.target.result);
        this.recipeForm.get('image')?.setValue(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.imagePreview.set(null);
    this.recipeForm.get('image')?.setValue('');
  }

  canProceed(): boolean {
    switch (this.currentStep()) {
      case 1:
        return !!(this.recipeForm.get('title')?.valid &&
          this.recipeForm.get('description')?.valid &&
          this.recipeForm.get('category')?.valid);
      case 2:
        return this.ingredientsArray.length > 0 &&
          this.ingredientsArray.controls.every(control =>
            !!(control.get('quantity')?.valid && control.get('name')?.valid)
          );
      case 3:
        return this.instructionsArray.length > 0 &&
          this.instructionsArray.controls.every(control =>
            !!control.get('text')?.valid
          );
      case 4:
        return !!(this.recipeForm.get('prepTime')?.valid &&
          this.recipeForm.get('cookTime')?.valid &&
          this.recipeForm.get('servings')?.valid);
      case 5:
        return true; // Image is optional
      case 6:
        return !!this.recipeForm.get('author')?.valid;
      default:
        return true;
    }
  }

  nextStep() {
    if (this.canProceed() && this.currentStep() < this.totalSteps) {
      this.currentStep.update(step => step + 1);
    }
  }

  previousStep() {
    if (this.currentStep() > 1) {
      this.currentStep.update(step => step - 1);
    }
  }

  goToStep(step: number) {
    this.currentStep.set(step);
  }

  saveAsDraft() {
    if (!this.recipeForm.valid) {
      this.markFormGroupTouched(this.recipeForm);
      return;
    }

    const recipeData = this.buildRecipeData(true);
    this.submissionStatus.set('loading');

    this.http.post<any>('/api/recipe', recipeData).subscribe({
      next: (response) => {
        this.submissionStatus.set('success');
        this.submissionMessage.set(response.message || 'Recipe saved as draft successfully!');
        setTimeout(() => this.submissionStatus.set(null), 3000);
      },
      error: (error) => {
        this.submissionStatus.set('error');
        this.submissionMessage.set(error.error?.message || 'Error saving recipe. Please try again.');
        setTimeout(() => this.submissionStatus.set(null), 5000);
      }
    });
  }

  publishRecipe() {
    if (!this.recipeForm.valid) {
      this.markFormGroupTouched(this.recipeForm);
      return;
    }

    const recipeData = this.buildRecipeData(false);
    this.submissionStatus.set('loading');

    this.http.post<any>(`${this.apiUrl}/create`, recipeData).subscribe({
      next: (response) => {
        this.submissionStatus.set('success');
        this.submissionMessage.set(response.message || 'Recipe published successfully!');
        setTimeout(() => {
          this.submissionStatus.set(null);
          this.resetForm();
        }, 3000);
      },
      error: (error) => {
        this.submissionStatus.set('error');
        this.submissionMessage.set(error.error?.message || 'Error publishing recipe. Please try again.');
        setTimeout(() => this.submissionStatus.set(null), 5000);
      }
    });
  }

  private buildRecipeData(isDraft: boolean = false): Recipe {
    const formValue = this.recipeForm.value;
    return {
      title: formValue.title,
      description: formValue.description,
      category: formValue.category,
      tags: this.tags(),
      ingredients: formValue.ingredients,
      instructions: formValue.instructions,
      prepTime: formValue.prepTime,
      cookTime: formValue.cookTime,
      servings: formValue.servings,
      author: formValue.author,
      image: formValue.image,
      status: isDraft ? 'draft' : 'published'
    };
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });

      if (control instanceof FormArray) {
        control.controls.forEach((arrayControl) => {
          if (arrayControl instanceof FormGroup) {
            this.markFormGroupTouched(arrayControl);
          }
        });
      }
    });
  }

  private resetForm() {
    this.recipeForm.reset();
    this.tags.set([]);
    this.imagePreview.set(null);
    this.currentStep.set(1);

    // Clear arrays and add initial items
    while (this.ingredientsArray.length !== 0) {
      this.ingredientsArray.removeAt(0);
    }
    while (this.instructionsArray.length !== 0) {
      this.instructionsArray.removeAt(0);
    }

    this.addIngredient();
    this.addInstruction();
  }

  // Utility methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.recipeForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.recipeForm.get(fieldName);
    if (field && field.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['maxlength']) return `${fieldName} is too long`;
      if (field.errors['min']) return `${fieldName} must be greater than 0`;
    }
    return '';
  }

  isIngredientInvalid(index: number, fieldName: string): boolean {
    const ingredient = this.ingredientsArray.at(index);
    const field = ingredient.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  isInstructionInvalid(index: number, fieldName: string): boolean {
    const instruction = this.instructionsArray.at(index);
    const field = instruction.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getTotalTime(): number {
    const prepTime = this.recipeForm.get('prepTime')?.value || 0;
    const cookTime = this.recipeForm.get('cookTime')?.value || 0;
    return prepTime + cookTime;
  }
}